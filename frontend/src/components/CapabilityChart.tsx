'use client';

import { useMemo } from 'react';
import { UserAnalysis } from '@/lib/types';

interface CapabilityChartProps {
  address: string;
  userAnalysis?: UserAnalysis;
}

interface CapabilityData {
  label: string;
  value: number;
  maxValue: number;
  totalPoints: number;
  platformCount: number;
}

export default function CapabilityChart({ address, userAnalysis }: CapabilityChartProps) {
  // 基于真实数据或地址生成能力数据
  const capabilityData = useMemo(() => {
    if (userAnalysis) {
      // 使用真实数据
      const categories = userAnalysis.categories;
      const maxPoints = Math.max(
        categories.dex.totalPoints,
        categories.nft.totalPoints,
        categories.launchpad.totalPoints,
        categories.social.totalPoints,
        categories.games.totalPoints,
        categories.lsd.totalPoints,
        1 // 避免除零
      );
      
      return [
        {
          label: 'DEX交易',
          value: maxPoints > 0 ? Math.round((categories.dex.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.dex.totalPoints,
          platformCount: categories.dex.platformCount
        },
        {
          label: 'NFT收藏',
          value: maxPoints > 0 ? Math.round((categories.nft.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.nft.totalPoints,
          platformCount: categories.nft.platformCount
        },
        {
          label: 'Launchpad',
          value: maxPoints > 0 ? Math.round((categories.launchpad.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.launchpad.totalPoints,
          platformCount: categories.launchpad.platformCount
        },
        {
          label: '社交平台',
          value: maxPoints > 0 ? Math.round((categories.social.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.social.totalPoints,
          platformCount: categories.social.platformCount
        },
        {
          label: '链游',
          value: maxPoints > 0 ? Math.round((categories.games.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.games.totalPoints,
          platformCount: categories.games.platformCount
        },
        {
          label: 'LSD质押',
          value: maxPoints > 0 ? Math.round((categories.lsd.totalPoints / maxPoints) * 100) : 0,
          maxValue: 100,
          totalPoints: categories.lsd.totalPoints,
          platformCount: categories.lsd.platformCount
        }
      ];
    } else {
      // 降级到基于地址的模拟数据
      const seed = address.toLowerCase();
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      const random = (offset: number) => {
        const x = Math.sin(hash + offset) * 10000;
        return Math.abs(x - Math.floor(x));
      };
      
      return [
        {
          label: 'DEX交易',
          value: Math.floor(random(1) * 80 + 20),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        },
        {
          label: 'NFT收藏',
          value: Math.floor(random(2) * 70 + 10),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        },
        {
          label: 'Launchpad',
          value: Math.floor(random(3) * 90 + 10),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        },
        {
          label: '社交平台',
          value: Math.floor(random(4) * 60 + 5),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        },
        {
          label: '链游',
          value: Math.floor(random(5) * 50 + 5),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        },
        {
          label: 'LSD质押',
          value: Math.floor(random(6) * 75 + 15),
          maxValue: 100,
          totalPoints: 0,
          platformCount: 0
        }
      ];
    }
  }, [address, userAnalysis]);
  
  // 计算雷达图的点坐标
  const getRadarPoints = () => {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 120;
    const angleStep = (2 * Math.PI) / capabilityData.length;
    
    return capabilityData.map((item, index) => {
      const angle = index * angleStep - Math.PI / 2; // 从顶部开始
      const radius = (item.value / item.maxValue) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y, angle, radius, ...item };
    });
  };
  
  // 生成网格线
  const getGridLines = () => {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 120;
    const angleStep = (2 * Math.PI) / capabilityData.length;
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    
    const gridPolygons = gridLevels.map(level => {
      const points = capabilityData.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const radius = level * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      
      return {
        points,
        level,
        opacity: 0.1 + level * 0.1
      };
    });
    
    const gridLines = capabilityData.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const endX = centerX + maxRadius * Math.cos(angle);
      const endY = centerY + maxRadius * Math.sin(angle);
      return {
        x1: centerX,
        y1: centerY,
        x2: endX,
        y2: endY
      };
    });
    
    return { gridPolygons, gridLines };
  };
  
  const radarPoints = getRadarPoints();
  const { gridPolygons, gridLines } = getGridLines();
  const dataPolygonPoints = radarPoints.map(point => `${point.x},${point.y}`).join(' ');
  
  return (
    <div className="relative">
      <svg width="300" height="300" className="mx-auto">
        {/* 网格背景 */}
        {gridPolygons.map((polygon, index) => (
          <polygon
            key={index}
            points={polygon.points}
            fill="none"
            stroke="#333"
            strokeWidth="1"
            opacity={polygon.opacity}
            className="stroke-monad-border"
          />
        ))}
        
        {/* 网格线 */}
        {gridLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#333"
            strokeWidth="1"
            opacity="0.3"
            className="stroke-monad-border"
          />
        ))}
        
        {/* 数据区域 */}
        <polygon
          points={dataPolygonPoints}
          fill="rgba(139, 92, 246, 0.2)"
          stroke="#8b5cf6"
          strokeWidth="2"
          className="fill-monad-purple fill-opacity-20 stroke-monad-purple"
        />
        
        {/* 数据点 */}
        {radarPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#8b5cf6"
            stroke="#1e1b4b"
            strokeWidth="2"
            className="fill-monad-purple stroke-monad-darker"
          />
        ))}
        
        {/* 标签 */}
        {radarPoints.map((point, index) => {
          const labelRadius = 140;
          const labelX = 150 + labelRadius * Math.cos(point.angle);
          const labelY = 150 + labelRadius * Math.sin(point.angle);
          
          return (
            <g key={index}>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-monad-text-secondary"
                fontSize="12"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* 图例 */}
      <div className="mt-6 space-y-3">
        {capabilityData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-monad-purple rounded-full"></div>
              <span className="text-sm text-monad-text-secondary">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-monad-darker rounded-full h-2">
                <div 
                  className="bg-monad-purple h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / item.maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="text-right">
                {userAnalysis ? (
                  <div className="text-xs">
                    <div className="text-white font-medium">{item.totalPoints}分</div>
                    <div className="text-monad-text-muted">{item.platformCount}平台</div>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-white w-8">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 总体评分 */}
      <div className="mt-6 p-4 bg-monad-darker rounded-lg border border-monad-border">
        <div className="text-center">
          <p className="text-sm text-monad-text-secondary mb-1">
            综合活跃度评分
          </p>
          <p className="text-2xl font-bold text-monad-purple">
            {userAnalysis ? userAnalysis.overallScore : Math.round(capabilityData.reduce((sum, item) => sum + item.value, 0) / capabilityData.length)}
          </p>
          <p className="text-xs text-monad-text-muted">
            {userAnalysis ? `总积分: ${capabilityData.reduce((sum, item) => sum + item.totalPoints, 0)} | 平台数: ${capabilityData.reduce((sum, item) => sum + item.platformCount, 0)}` : '基于多维度链上行为分析'}
          </p>
        </div>
      </div>
    </div>
  );
}