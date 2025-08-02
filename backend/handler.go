package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"strings"
)

// 处理积分数据
func processPointsData(points [][]interface{}) error {
	// 按表名分组数据
	tableData := make(map[string][]PointRecord)
	var total Total
	db.First(&total, 1)
	for i, point := range points {
		// 验证数据格式
		if len(point) != 4 {
			log.Printf("Skipping invalid data at index %d: expected 4 elements, got %d", i, len(point))
			continue
		}

		// 提取数据
		address, ok1 := point[0].(string)
		category, ok2 := point[1].(string)
		platform, ok3 := point[2].(string)
		pointValue, ok4 := point[3].(float64)

		if !ok1 || !ok2 || !ok3 || !ok4 {
			log.Printf("Skipping invalid data types at index %d", i)
			continue
		}

		// 清理表名
		tableName := strings.ToLower(strings.TrimSpace(category))

		// 准备数据
		record := PointRecord{
			Address:  address,
			Platform: platform,
			Point:    int(pointValue),
		}

		// 按表名分组
		tableData[tableName] = append(tableData[tableName], record)
	}

	// 批量处理每个表的数据
	for tableName, records := range tableData {
		go func() {
			if err := batchUpsertData(tableName, records); err != nil {
				log.Printf("Failed to batch upsert data to table %s: %v", tableName, err)
			}
		}()
	}

	return nil
}

func webhookHandler(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error reading body",
		})
		return
	}

	// 解析JSON数据
	var jsonData map[string]interface{}
	if err = json.Unmarshal(body, &jsonData); err != nil {
		fmt.Println("Error parsing JSON:", err)
		fmt.Println("Raw body:", string(body))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON",
		})
		return
	}

	// 提取points数组
	pointsInterface, exists := jsonData["points"]
	if !exists {
		fmt.Println("No 'points' field found in JSON")
		c.String(http.StatusOK, "No points data found")
		return
	}

	// 转换为二维数组
	pointsArray, ok := pointsInterface.([]interface{})
	if !ok {
		fmt.Println("Points field is not an array")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid points data format",
		})
		return
	}

	// 转换数据格式
	var points [][]interface{}
	for _, item := range pointsArray {
		if pointArray, ok := item.([]interface{}); ok {
			points = append(points, pointArray)
		}
	}

	// 处理并存储数据
	if err = processPointsData(points); err != nil {
		fmt.Printf("Error processing points data: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to process data",
		})
		return
	}

	// 返回处理结果
	c.JSON(http.StatusOK, gin.H{
		"status":            "success",
		"message":           "Webhook received and data stored successfully",
		"processed_records": len(points),
	})
}

func addressHandler(c *gin.Context) {
	address := c.Param("address")

	// 记录请求
	fmt.Printf("Querying address: %s\n", address)

	// 查询地址数据
	addressData, err := queryAddressFromAllTables(address)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to query address data",
			"details": err,
		})
		return
	}

	// 返回结果
	c.JSON(http.StatusOK, addressData)
}
