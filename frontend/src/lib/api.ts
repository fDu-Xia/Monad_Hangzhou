// API调用和数据分析函数
import { BackendUserData, UserAnalysis, CategoryAnalysis, UserData } from './types';

/**
 * 从后端获取用户数据
 * @param address 钱包地址
 * @returns 后端用户数据
 */
export async function fetchUserData(address: string): Promise<BackendUserData> {
  try {
    const response = await fetch(`/address/${address}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as BackendUserData;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw new Error('无法获取用户数据，请检查网络连接或后端服务');
  }
}

/**
 * 分析单个类别的数据
 * @param categoryData 类别数据数组
 * @param categoryName 类别名称
 * @returns 类别分析结果
 */
function analyzeCategoryData(categoryData: any[], categoryName: string): CategoryAnalysis {
  const totalPoints = categoryData.reduce((sum, item) => sum + item.point, 0);
  const platformCount = categoryData.length;
  const averagePoints = platformCount > 0 ? totalPoints / platformCount : 0;
  
  // 获取积分最高的平台
  const topPlatforms = categoryData
    .sort((a, b) => b.point - a.point)
    .slice(0, 3)
    .map(item => item.platform);
  
  // 根据积分和平台数量判断活跃度
  let activityLevel: 'inactive' | 'low' | 'medium' | 'high' = 'inactive';
  if (platformCount === 0) {
    activityLevel = 'inactive';
  } else if (platformCount <= 2 && averagePoints < 50) {
    activityLevel = 'low';
  } else if (platformCount <= 5 && averagePoints < 80) {
    activityLevel = 'medium';
  } else {
    activityLevel = 'high';
  }
  
  // 生成描述
  let description = '';
  switch (categoryName) {
    case 'dex':
      description = platformCount > 0 
        ? `在${platformCount}个DEX平台上有活动，平均积分${averagePoints.toFixed(1)}，显示出${activityLevel === 'high' ? '高度' : activityLevel === 'medium' ? '中等' : '较低'}的DeFi交易活跃度`
        : '暂无DEX交易记录';
      break;
    case 'nft':
      description = platformCount > 0
        ? `参与了${platformCount}个NFT平台，平均积分${averagePoints.toFixed(1)}，表现出${activityLevel === 'high' ? '强烈' : activityLevel === 'medium' ? '一定' : '较少'}的NFT收藏兴趣`
        : '暂无NFT相关活动';
      break;
    case 'launchpad':
      description = platformCount > 0
        ? `在${platformCount}个Launchpad平台参与项目，平均积分${averagePoints.toFixed(1)}，显示${activityLevel === 'high' ? '积极' : activityLevel === 'medium' ? '适度' : '有限'}的早期项目投资倾向`
        : '暂无Launchpad参与记录';
      break;
    case 'social':
      description = platformCount > 0
        ? `活跃于${platformCount}个社交平台，平均积分${averagePoints.toFixed(1)}，展现${activityLevel === 'high' ? '高度' : activityLevel === 'medium' ? '中等' : '较低'}的社区参与度`
        : '暂无社交平台活动';
      break;
    case 'games':
      description = platformCount > 0
        ? `参与${platformCount}个链游项目，平均积分${averagePoints.toFixed(1)}，表现出${activityLevel === 'high' ? '强烈' : activityLevel === 'medium' ? '一定' : '较少'}的GameFi兴趣`
        : '暂无链游参与记录';
      break;
    case 'lsd':
      description = platformCount > 0
        ? `在${platformCount}个LSD平台有质押活动，平均积分${averagePoints.toFixed(1)}，显示${activityLevel === 'high' ? '积极' : activityLevel === 'medium' ? '适度' : '有限'}的流动性质押参与`
        : '暂无LSD质押记录';
      break;
    default:
      description = '数据分析中...';
  }
  
  return {
    totalPoints,
    platformCount,
    averagePoints,
    topPlatforms,
    activityLevel,
    description
  };
}

/**
 * 综合分析用户数据
 * @param backendData 后端返回的用户数据
 * @returns 用户综合分析结果
 */
export function analyzeUserData(backendData: BackendUserData): UserAnalysis {
  // 分析各个类别
  const categories = {
    dex: analyzeCategoryData(backendData.dex, 'dex'),
    nft: analyzeCategoryData(backendData.nft, 'nft'),
    launchpad: analyzeCategoryData(backendData.launchpad, 'launchpad'),
    social: analyzeCategoryData(backendData.social, 'social'),
    games: analyzeCategoryData(backendData.games, 'games'),
    lsd: analyzeCategoryData(backendData.lsd, 'lsd')
  };
  
  // 计算总体积分
  const totalPoints = Object.values(categories).reduce((sum, cat) => sum + cat.totalPoints, 0);
  const totalPlatforms = Object.values(categories).reduce((sum, cat) => sum + cat.platformCount, 0);
  const averageScore = totalPlatforms > 0 ? totalPoints / totalPlatforms : 0;
  
  // 计算综合评分 (0-100)
  const overallScore = Math.min(100, Math.round(
    (totalPoints * 0.6 + totalPlatforms * 5) * 0.8
  ));
  
  // 判断活跃度等级
  let activityLevel: 'low' | 'medium' | 'high' = 'low';
  if (totalPlatforms >= 10 && averageScore >= 70) {
    activityLevel = 'high';
  } else if (totalPlatforms >= 5 && averageScore >= 40) {
    activityLevel = 'medium';
  }
  
  // 判断风险等级
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (categories.dex.platformCount > 8 || categories.launchpad.platformCount > 5) {
    riskLevel = 'high';
  } else if (categories.dex.platformCount > 4 || categories.launchpad.platformCount > 2) {
    riskLevel = 'medium';
  }
  
  // 生成综合总结
  const activeCategoriesCount = Object.values(categories).filter(cat => cat.platformCount > 0).length;
  const topCategory = Object.entries(categories)
    .sort(([,a], [,b]) => b.totalPoints - a.totalPoints)[0];
  
  let summary = '';
  if (totalPlatforms === 0) {
    summary = '该地址暂无链上活动记录，可能是新地址或较少使用的地址。';
  } else {
    const categoryNames = {
      dex: 'DeFi交易',
      nft: 'NFT收藏',
      launchpad: '项目投资',
      social: '社交互动',
      games: '链游娱乐',
      lsd: '流动性质押'
    };
    
    summary = `该地址在${activeCategoriesCount}个领域有活动，总计参与${totalPlatforms}个平台，` +
      `综合评分${overallScore}分。最活跃的领域是${categoryNames[topCategory[0] as keyof typeof categoryNames]}，` +
      `显示出${activityLevel === 'high' ? '高度' : activityLevel === 'medium' ? '中等' : '较低'}的链上活跃度。`;
  }
  
  // 生成建议
  const recommendations: string[] = [];
  
  if (activityLevel === 'low') {
    recommendations.push('建议增加链上活动，探索更多DeFi协议和应用');
  }
  
  if (categories.dex.platformCount === 0) {
    recommendations.push('可以尝试参与DEX交易，体验去中心化金融服务');
  }
  
  if (categories.nft.platformCount === 0 && activityLevel !== 'low') {
    recommendations.push('考虑参与NFT市场，丰富数字资产组合');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('注意风险管理，避免过度集中在高风险项目');
  }
  
  if (categories.social.platformCount === 0) {
    recommendations.push('参与社区治理和社交平台，提升链上声誉');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('继续保持当前的活跃度，关注新兴项目机会');
  }
  
  return {
    address: backendData.address,
    overallScore,
    activityLevel,
    riskLevel,
    categories,
    summary,
    recommendations
  };
}

/**
 * 将后端数据转换为前端UserData格式
 * @param backendData 后端数据
 * @param analysis 分析结果
 * @returns 前端UserData格式
 */
export function convertToUserData(backendData: BackendUserData, analysis: UserAnalysis): UserData {
  const totalPlatforms = Object.values(analysis.categories).reduce((sum, cat) => sum + cat.platformCount, 0);
  const totalPoints = Object.values(analysis.categories).reduce((sum, cat) => sum + cat.totalPoints, 0);
  
  // 生成标签
  const tags: string[] = [];
  Object.entries(analysis.categories).forEach(([key, cat]) => {
    if (cat.activityLevel === 'high') {
      const categoryLabels = {
        dex: 'DeFi专家',
        nft: 'NFT收藏家',
        launchpad: '早期投资者',
        social: '社区活跃者',
        games: 'GameFi玩家',
        lsd: '质押专家'
      };
      tags.push(categoryLabels[key as keyof typeof categoryLabels]);
    }
  });
  
  if (analysis.activityLevel === 'high') tags.push('链上活跃用户');
  if (analysis.riskLevel === 'low') tags.push('稳健投资者');
  if (totalPlatforms > 15) tags.push('多元化用户');
  
  return {
    address: backendData.address,
    totalTransactions: totalPlatforms * 10, // 估算
    totalValue: totalPoints * 1000, // 估算
    firstActivity: '2023-01-01', // 默认值
    lastActivity: new Date().toISOString(),
    riskScore: analysis.riskLevel === 'high' ? 75 : analysis.riskLevel === 'medium' ? 45 : 25,
    activityScore: analysis.overallScore,
    balance: Math.random() * 10, // 随机值
    tokenCount: totalPlatforms * 2,
    nftCount: analysis.categories.nft.platformCount * 5,
    defiProtocols: analysis.categories.dex.platformCount + analysis.categories.lsd.platformCount,
    avgTransactionValue: totalPoints > 0 ? (totalPoints * 100) / totalPlatforms : 0,
    mostActiveHour: Math.floor(Math.random() * 24),
    preferredNetwork: 'Ethereum',
    tags
  };
}