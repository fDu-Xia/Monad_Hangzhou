'use client';

import { BackendUserData } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { ExternalLink, ArrowUpRight, ArrowDownRight, Repeat, Coins, Palette, Rocket, Users, Gamepad2, Gem } from 'lucide-react';

interface RealActivityListProps {
  backendData: BackendUserData;
  address: string;
  maxItems?: number;
}

interface ActivityItem {
  id: string;
  type: string;
  platform: string;
  points: number;
  category: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

export default function RealActivityList({ backendData, address, maxItems = 10 }: RealActivityListProps) {
  // 将所有活动数据转换为统一格式
  const activities: ActivityItem[] = [];
  
  // 处理DEX活动
  backendData.dex.forEach((item, index) => {
    activities.push({
      id: `dex-${item.id || index}`,
      type: 'DEX交易',
      platform: item.platform,
      points: item.point,
      category: 'dex',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // 随机30天内
      icon: <Repeat className="h-4 w-4" />,
      color: 'text-blue-500'
    });
  });
  
  // 处理NFT活动
  backendData.nft.forEach((item, index) => {
    activities.push({
      id: `nft-${item.id || index}`,
      type: 'NFT交易',
      platform: item.platform,
      points: item.point,
      category: 'nft',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Palette className="h-4 w-4" />,
      color: 'text-purple-500'
    });
  });
  
  // 处理Launchpad活动
  backendData.launchpad.forEach((item, index) => {
    activities.push({
      id: `launchpad-${item.id || index}`,
      type: 'Launchpad参与',
      platform: item.platform,
      points: item.point,
      category: 'launchpad',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Rocket className="h-4 w-4" />,
      color: 'text-green-500'
    });
  });
  
  // 处理社交活动
  backendData.social.forEach((item, index) => {
    activities.push({
      id: `social-${item.id || index}`,
      type: '社交互动',
      platform: item.platform,
      points: item.point,
      category: 'social',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Users className="h-4 w-4" />,
      color: 'text-pink-500'
    });
  });
  
  // 处理游戏活动
  backendData.games.forEach((item, index) => {
    activities.push({
      id: `games-${item.id || index}`,
      type: '链游参与',
      platform: item.platform,
      points: item.point,
      category: 'games',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Gamepad2 className="h-4 w-4" />,
      color: 'text-orange-500'
    });
  });
  
  // 处理LSD活动
  backendData.lsd.forEach((item, index) => {
    activities.push({
      id: `lsd-${item.id || index}`,
      type: 'LSD质押',
      platform: item.platform,
      points: item.point,
      category: 'lsd',
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Gem className="h-4 w-4" />,
      color: 'text-cyan-500'
    });
  });
  
  // 按积分排序，显示最重要的活动
  const sortedActivities = activities
    .sort((a, b) => b.points - a.points)
    .slice(0, maxItems);
  
  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-monad-text-muted mb-2">暂无活动记录</div>
        <p className="text-sm text-monad-text-secondary">该地址尚未在支持的平台上产生活动</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {sortedActivities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between p-3 bg-monad-darker rounded-lg border border-monad-border hover:border-monad-purple transition-colors">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-opacity-20 flex items-center justify-center ${activity.color.replace('text-', 'bg-')}`}>
              <span className={activity.color}>
                {activity.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium text-sm">{activity.type}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-monad-purple bg-opacity-20 text-monad-purple">
                  {activity.platform}
                </span>
              </div>
              <div className="text-xs text-monad-text-muted space-y-1">
                <div>地址: {address}</div>
                <div>平台: {activity.platform}</div>
                <div>积分: {activity.points}</div>
                <div>{formatTimestamp(activity.timestamp)}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-medium text-sm">{activity.points} 积分</div>
            <div className="text-xs text-monad-text-muted">{activity.category.toUpperCase()}</div>
          </div>
        </div>
      ))}
      
      {activities.length > maxItems && (
        <div className="text-center pt-2">
          <span className="text-sm text-monad-text-secondary">
            还有 {activities.length - maxItems} 项活动...
          </span>
        </div>
      )}
    </div>
  );
}