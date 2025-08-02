// 用户数据类型定义
export interface UserData {
  address: string;
  totalTransactions: number;
  totalValue: number;
  firstActivity: string;
  lastActivity: string;
  riskScore: number;
  activityScore: number;
  balance: number;
  tokenCount: number;
  nftCount: number;
  defiProtocols: number;
  avgTransactionValue: number;
  mostActiveHour: number;
  preferredNetwork: string;
  tags: string[];
}

// 活动数据类型定义
export interface Activity {
  id: string;
  type: string;
  amount: number;
  timestamp: string;
  hash: string;
  status: 'success' | 'failed' | 'pending';
  from?: string;
  to?: string;
  gasUsed?: number;
  gasPrice?: number;
  blockNumber?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
  protocol?: string;
  description?: string;
}

// 搜索结果类型定义
export interface SearchResult {
  type: 'address' | 'transaction' | 'block' | 'token';
  value: string;
  label: string;
  description?: string;
  verified?: boolean;
  tags?: string[];
}

// API响应类型定义
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// 活动统计类型定义
export interface ActivityStats {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  totalVolume: number;
  avgAmount: number;
}

// 能力数据类型定义
export interface CapabilityData {
  label: string;
  value: number;
  maxValue: number;
}

// 网络配置类型定义
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// 代币信息类型定义
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  verified: boolean;
}

// 交易详情类型定义
export interface TransactionDetail {
  hash: string;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  gasLimit: string;
  nonce: number;
  timestamp: string;
  status: 'success' | 'failed';
  logs: TransactionLog[];
}

// 交易日志类型定义
export interface TransactionLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
}

// 分页参数类型定义
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 筛选参数类型定义
export interface FilterParams {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  protocol?: string;
}

// 用户偏好设置类型定义
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  currency: 'USD' | 'CNY' | 'ETH';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showBalance: boolean;
    showActivity: boolean;
    allowAnalytics: boolean;
  };
}

// 后端API数据类型定义
export interface BackendPlatformData {
  id: number;
  address: string;
  platform: string;
  point: number;
}

export interface BackendUserData {
  address: string;
  dex: BackendPlatformData[];
  nft: BackendPlatformData[];
  launchpad: BackendPlatformData[];
  social: BackendPlatformData[];
  games: BackendPlatformData[];
  lsd: BackendPlatformData[];
}

// 综合分析结果类型定义
export interface UserAnalysis {
  address: string;
  overallScore: number;
  activityLevel: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  categories: {
    dex: CategoryAnalysis;
    nft: CategoryAnalysis;
    launchpad: CategoryAnalysis;
    social: CategoryAnalysis;
    games: CategoryAnalysis;
    lsd: CategoryAnalysis;
  };
  summary: string;
  recommendations: string[];
}

export interface CategoryAnalysis {
  totalPoints: number;
  platformCount: number;
  averagePoints: number;
  topPlatforms: string[];
  activityLevel: 'inactive' | 'low' | 'medium' | 'high';
  description: string;
}