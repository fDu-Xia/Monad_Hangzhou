package main

import (
	"errors"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"time"
)

// 全局数据库连接
var db *gorm.DB

// 数据库配置
const (
	DBUser     = "root"
	DBPassword = "xiadezhi666"
	DBHost     = "nj-cdb-686m7tin.sql.tencentcdb.com"
	DBPort     = "27371"
	DBName     = "trustornic"
)

// 初始化数据库连接
func initDB() {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		DBUser, DBPassword, DBHost, DBPort, DBName)

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // 打印SQL日志
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB:", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	fmt.Println("Database connected successfully")
}

func batchUpsertData(tableName string, records []PointRecord) error {
	if len(records) == 0 {
		return nil
	}

	// 使用事务进行批量操作
	return db.Transaction(func(tx *gorm.DB) error {
		for _, record := range records {
			var existingRecord PointRecord
			result := tx.Table(tableName).Where("address = ? AND platform = ?",
				record.Address, record.Platform).First(&existingRecord)

			if result.Error != nil {
				if errors.Is(result.Error, gorm.ErrRecordNotFound) {
					if err := tx.Table(tableName).Create(&record).Error; err != nil {
						return err
					}
				} else {
					return result.Error
				}
			} else {
				if err := tx.Table(tableName).Where("address = ? AND platform = ?",
					record.Address, record.Platform).
					Update("point", gorm.Expr("point + ?", record.Point)).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}

func queryAddressFromAllTables(address string) (*AddressData, error) {
	// 定义要查询的表
	tables := []string{"dex", "nft", "launchpad", "socialfi", "gamefi", "lsd"}

	// 创建通道接收查询结果
	resultChan := make(chan TableQueryResult, len(tables))

	// 并发查询所有表
	for _, tableName := range tables {
		go func(table string) {
			var records []PointRecord
			err := db.Table(table).Where("address = ?", address).Find(&records).Error

			resultChan <- TableQueryResult{
				TableName: table,
				Records:   records,
				Error:     err,
			}
		}(tableName)
	}

	// 收集所有查询结果
	results := make(map[string][]PointRecord)
	var queryErrors []string

	for i := 0; i < len(tables); i++ {
		result := <-resultChan
		if result.Error != nil {
			queryErrors = append(queryErrors, fmt.Sprintf("%s: %v", result.TableName, result.Error))
			results[result.TableName] = []PointRecord{} // 出错时返回空数组
		} else {
			results[result.TableName] = result.Records
		}
	}

	// 如果有查询错误，记录日志但不阻断返回
	if len(queryErrors) > 0 {
		log.Printf("Address query errors: %v", queryErrors)
	}

	// 构建返回数据
	addressData := &AddressData{
		Address:   address,
		Dex:       results["dex"],
		NFT:       results["nft"],
		Launchpad: results["launchpad"],
		Social:    results["socialfi"],
		Games:     results["gamefi"],
		LSD:       results["lsd"],
	}

	return addressData, nil
}
