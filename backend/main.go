package main

import (
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// 初始化数据库
	initDB()

	// 获取底层sql.DB以便在程序结束时关闭
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB:", err)
	}
	defer sqlDB.Close()

	// 设置Gin模式 (可选：gin.ReleaseMode 用于生产环境)
	gin.SetMode(gin.DebugMode)

	// 创建Gin路由
	r := gin.Default()

	// 添加中间件
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// 设置路由
	r.POST("/webhook", webhookHandler)
	r.GET("/address", addressHandler)

	// 启动服务器
	log.Fatal(r.Run(":80"))
}
