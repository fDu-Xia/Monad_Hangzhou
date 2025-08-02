'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Activity, Wallet, Calendar, DollarSign, AlertTriangle, Shield, Zap } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

import RealActivityList from '@/components/RealActivityList';
import CapabilityChart from '@/components/CapabilityChart';
import { formatAddress, formatNumber, formatCurrency, formatTimestamp } from '@/lib/utils';
import { UserData, UserAnalysis, BackendUserData } from '@/lib/types';
import { fetchUserData, analyzeUserData, convertToUserData } from '@/lib/api';

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  const [userData, setUserData] = useState<UserData | null>(null);

  const [userAnalysis, setUserAnalysis] = useState<UserAnalysis | null>(null);
  const [backendData, setBackendData] = useState<BackendUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 示例用户活动数据
  const sampleUserData = {
    "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
    "dex": [
      {
        "id": 82,
        "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
        "platform": "bean",
        "point": 1
      }
    ],
    "nft": [],
    "launchpad": [],
    "social": [],
    "games": [],
    "lsd": [
      {
        "id": 0,
        "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
        "platform": "aPriori",
        "point": 1
      },
      {
        "id": 0,
        "address": "0x827e44229cd2159fbd7d7182c4c7f6d5a1fbdd04",
        "platform": "magma",
        "point": 1
      }
    ]
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 从后端获取真实数据
        const backendUserData = await fetchUserData(address);
        setBackendData(backendUserData);
        
        // 分析用户数据
        const analysis = analyzeUserData(backendUserData);
        setUserAnalysis(analysis);
        
        // 转换为前端格式
        const convertedUserData = convertToUserData(backendUserData, analysis);
        setUserData(convertedUserData);
        
        // 不再需要mock活动数据
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : '获取数据失败');
        
        // 不再使用mock数据作为降级方案
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ambient-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-monad-purple"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-ambient-gradient flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{error ? '数据获取失败' : '地址未找到'}</h2>
        <p className="text-monad-text-secondary mb-6">{error || '无法找到该地址的相关信息'}</p>
        <Link href="/" className="btn-primary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> 返回首页
        </Link>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getActivityColor = (score: number) => {
    if (score < 30) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  // 计算用户活动统计数据
  const calculateUserStats = (data: any) => {
    if (!data) return { totalPoints: 0, totalActivities: 0, activeCategories: 0, avgPoints: 0, mostActiveCategory: '暂无' };
    
    const categories = ['dex', 'nft', 'launchpad', 'social', 'games', 'lsd'];
    let totalPoints = 0;
    let totalActivities = 0;
    let activeCategories = 0;
    let mostActiveCategory = '暂无';
    let maxPoints = 0;
    
    const categoryNames = {
      dex: 'DEX交易',
      nft: 'NFT收藏', 
      launchpad: 'Launchpad',
      social: '社交平台',
      games: '链游',
      lsd: 'LSD质押'
    };
    
    categories.forEach(category => {
      if (data[category] && Array.isArray(data[category]) && data[category].length > 0) {
        activeCategories++;
        const categoryPoints = data[category].reduce((sum: number, item: any) => sum + (item.point || 0), 0);
        const categoryActivities = data[category].length;
        
        totalPoints += categoryPoints;
        totalActivities += categoryActivities;
        
        if (categoryPoints > maxPoints) {
          maxPoints = categoryPoints;
          mostActiveCategory = categoryNames[category as keyof typeof categoryNames];
        }
      }
    });
    
    const avgPoints = totalActivities > 0 ? (totalPoints / totalActivities) : 0;
    
    return {
      totalPoints,
      totalActivities,
      activeCategories,
      avgPoints,
      mostActiveCategory
    };
  };

  return (
    <div className="bg-ambient-gradient">
      {/* Header */}
      <header className="border-b border-monad-border bg-monad-darker bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold gradient-text flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Trustonic
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* User Info */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <UserAvatar address={address} size={80} className="mr-6" />
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{formatAddress(address, 8, 6)}</h2>
                <div className="flex items-center">
                  <a 
                    href={`https://testnet.monadexplorer.com/address/${address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-monad-text-secondary hover:text-monad-purple flex items-center text-sm"
                  >
                    查看区块浏览器 <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.tags?.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-monad-purple bg-opacity-20 text-monad-purple">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:justify-end gap-4">
              <div className="flex flex-col items-center p-3 bg-monad-darker rounded-lg">
                <span className="text-monad-text-muted text-sm mb-1">风险评分</span>
                <span className={`text-xl font-bold ${getRiskColor(userAnalysis ? (userAnalysis.riskLevel === 'high' ? 75 : userAnalysis.riskLevel === 'medium' ? 45 : 25) : userData.riskScore)}`}>
                  {userAnalysis ? (userAnalysis.riskLevel === 'high' ? 75 : userAnalysis.riskLevel === 'medium' ? 45 : 25) : userData.riskScore}/100
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-monad-darker rounded-lg">
                <span className="text-monad-text-muted text-sm mb-1">活跃度</span>
                <span className={`text-xl font-bold ${getActivityColor(userAnalysis ? userAnalysis.overallScore : userData.activityScore)}`}>
                  {userAnalysis ? userAnalysis.overallScore : userData.activityScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-monad-border mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-monad-purple border-b-2 border-monad-purple' : 'text-monad-text-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            总览
          </button>

        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h3 className="text-lg font-medium text-white mb-4">链上总体评估</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const stats = calculateUserStats(backendData);
                    return (
                      <>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <Activity className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">总积分</p>
                            <p className="text-white font-medium">{stats.totalPoints}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <DollarSign className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">总活动数</p>
                            <p className="text-white font-medium">{stats.totalActivities}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <Wallet className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">活跃领域</p>
                            <p className="text-white font-medium">{stats.activeCategories}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">平均积分</p>
                            <p className="text-white font-medium">{stats.avgPoints.toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <Zap className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">最活跃领域</p>
                            <p className="text-white font-medium">{stats.mostActiveCategory}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-monad-purple bg-opacity-20 flex items-center justify-center mr-3">
                            <Shield className="h-5 w-5 text-monad-purple" />
                          </div>
                          <div>
                            <p className="text-monad-text-muted text-sm">综合评分</p>
                            <p className="text-white font-medium">
                              {userAnalysis ? `${userAnalysis.overallScore}/100` : `${Math.min(100, stats.totalPoints * 10)}/100`}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="card flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">最近活动</h3>

                </div>
                <div className="flex-1">
                    {backendData ? (
                      <RealActivityList backendData={backendData} address={address} maxItems={5} />
                    ) : (
                      <div className="text-center text-monad-text-muted py-8">
                        <p>暂无活动数据</p>
                      </div>
                    )}
                  </div>
              </div>
            </div>
            
            {/* Capability Chart */}
            <div className="card flex flex-col">
              <h3 className="text-lg font-medium text-white mb-4">能力分布</h3>
              <div className="flex justify-center flex-1 items-center">
                <CapabilityChart address={address} userAnalysis={userAnalysis || undefined} />
              </div>
            </div>
          </div>
        )}






      </main>

      {/* Footer */}
      <footer className="border-t border-monad-border py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold gradient-text mb-2">Trustonic</h2>
              <p className="text-monad-text-muted text-sm">© 2024 Trustonic.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-monad-text-secondary hover:text-monad-purple transition-colors">条款</a>
              <a href="#" className="text-monad-text-secondary hover:text-monad-purple transition-colors">隐私</a>
              <a href="#" className="text-monad-text-secondary hover:text-monad-purple transition-colors">文档</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}