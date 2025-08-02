package main

type PointRecord struct {
	ID       int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	Address  string `gorm:"type:varchar(42);not null;index" json:"address"`
	Platform string `gorm:"type:varchar(100);not null;index" json:"platform"`
	Point    int    `gorm:"not null;default:0" json:"point"`
}

type Total struct {
	ID        int64 `json:"id"`
	Dex       int   `json:"dex"`
	LSD       int   `json:"lsd"`
	NFT       int   `json:"nft"`
	LaunchPad int   `json:"launchpad"`
	GameFi    int   `json:"gamefi"`
	SocialFi  int   `json:"socialfi"`
}

// AddressData 地址查询结果结构
type AddressData struct {
	Address   string        `json:"address"`
	Dex       []PointRecord `json:"dex"`
	NFT       []PointRecord `json:"nft"`
	Launchpad []PointRecord `json:"launchpad"`
	Social    []PointRecord `json:"social"`
	Games     []PointRecord `json:"games"`
	LSD       []PointRecord `json:"lsd"`
}

// TableQueryResult 表查询结果
type TableQueryResult struct {
	TableName string        `json:"table_name"`
	Records   []PointRecord `json:"records"`
	Error     error         `json:"error,omitempty"`
}
