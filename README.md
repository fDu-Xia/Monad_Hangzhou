# Trustonic × MONAD

<div align="center">
  <img src="frontend/public/method-draw-image.svg" alt="Monad Logo" width="100" height="100">
  <h3>基于 Monad 区块链的去中心化可信度分析平台</h3>
</div>

## 🌟 项目概述

Trustonic 是一个专为 Monad 生态系统设计的可信度分析平台，通过实时监控用户在不同 DeFi 协议中的活动，为用户地址提供全面的可信度评估和积分系统。该平台支持多个生态版块，包括 DEX、LSD、NFT、LaunchPad、GameFi 和 SocialFi。

## 🎯 核心功能

### 🔍 地址搜索与分析
- **实时地址查询**: 支持以太坊地址格式的实时搜索
- **多维度评估**: 从 6 个主要生态版块分析用户活动
- **可视化展示**: 雷达图展示用户在各个领域的参与程度

### 📊 积分系统
- **平台积分**: 基于用户在不同协议中的交互次数计算积分
- **实时更新**: 通过区块链事件监听实时更新积分
- **综合评估**: 提供用户在整个 Monad 生态中的活跃度评分

### 🏗️ 支持的协议

#### DEX (去中心化交易所)
- **Kuru**: 高性能 AMM 协议
- **Bean**: 创新流动性挖矿平台  
- **Ambient**: 新一代集中流动性协议

#### LSD (流动性质押衍生品)
- **aPriori**: 智能质押协议
- **Magma**: 高收益质押平台
- **Fastlane**: 快速质押解决方案

#### LaunchPad (项目启动平台)
- **NAD**: 去中心化项目孵化器
- **AiCraft**: AI 驱动的项目平台
- **Flap**: 社区驱动的启动平台

#### GameFi (游戏金融)
- **2048**: 区块链版经典数字游戏
- **LevrBet**: 去中心化博彩平台

#### SocialFi (社交金融)
- **Talentum**: 人才社交网络
- **Dusted**: 去中心化社交平台
- **DeepDrop**: 深度社交互动协议

#### NFT (非同质化代币)
- **ExoGame**: 游戏 NFT 生态系统

## 🏗️ 技术架构

### 前端 (Frontend)
```
技术栈: Next.js 15 + React 19 + TypeScript + Tailwind CSS
主要功能:
- 响应式用户界面
- 实时数据可视化
- 地址搜索和导航
- 可信度分析展示
```

### 后端 (Backend)
```
技术栈: Go + Gin + GORM + MySQL
主要功能:
- RESTful API 服务
- 区块链数据处理
- 积分计算逻辑
- 数据库管理
```

### 数据流处理 (Stream Processing)
```
技术栈: Node.js + QuickNode Streams
主要功能:
- 实时区块链事件监听
- 交易数据过滤和处理
- 自动积分更新
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Go 1.24+
- MySQL 8.0+
- pnpm 或 npm

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/fDu-Xia/Monad_Hangzhou.git
cd Monad_Hangzhou
```

#### 2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..

# 安装后端依赖
cd backend
go mod tidy
cd ..
```

#### 3. 配置数据库
```bash
# 导入数据库结构
mysql -u username -p database_name < dump-trustornic-202508021834.sql
```

#### 4. 启动服务

**启动后端服务:**
```bash
cd backend
go run .
```

**启动前端服务:**
```bash
cd frontend
npm run dev
```

**启动数据流处理:**
```bash
cd quick_node_stream
node filter.js
```

### 5. 访问应用
- 前端界面: http://localhost:3000
- 后端API: http://localhost:80

## 📡 API 文档

### 核心端点

#### 获取地址数据
```http
GET /address?address={wallet_address}
```

**响应示例:**
```json
{
  "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
  "dex": [
    {
      "id": 82,
      "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
      "platform": "bean",
      "point": 1
    }
  ],
  "lsd": [...],
  "nft": [...],
  "launchpad": [...],
  "social": [...],
  "games": [...]
}
```

#### Webhook 数据接收
```http
POST /webhook
```

## 🔧 配置说明

### 环境变量

**后端配置:**
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=trustonic
```

**前端配置:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:80
```

## 📈 数据模型

### PointRecord 积分记录
```go
type PointRecord struct {
    ID       int64  `json:"id"`
    Address  string `json:"address"`
    Platform string `json:"platform"`
    Point    int    `json:"point"`
}
```

### AddressData 地址数据
```go
type AddressData struct {
    Address   string        `json:"address"`
    Dex       []PointRecord `json:"dex"`
    NFT       []PointRecord `json:"nft"`
    Launchpad []PointRecord `json:"launchpad"`
    Social    []PointRecord `json:"social"`
    Games     []PointRecord `json:"games"`
    LSD       []PointRecord `json:"lsd"`
}
```

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Monad 官网](https://monad.xyz/)
- [项目文档](docs/)
- [问题反馈](https://github.com/fDu-Xia/Monad_Hangzhou/issues)

## 📞 联系我们

- **项目维护者**: fDu-Xia
- **GitHub**: https://github.com/fDu-Xia/Monad_Hangzhou
- **问题报告**: [GitHub Issues](https://github.com/fDu-Xia/Monad_Hangzhou/issues)

---

<div align="center">
  <p>Made with ❤️ for the Monad Ecosystem</p>
  <p>© 2025 Trustonic. All rights reserved.</p>
</div>
