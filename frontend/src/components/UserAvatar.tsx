'use client';

import { useMemo } from 'react';

interface UserAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({ address, size = 40, className = '' }: UserAvatarProps) {
  // 基于地址生成一致的随机头像
  const avatarData = useMemo(() => {
    // 使用地址生成种子
    const seed = address.toLowerCase();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    // 生成颜色 - 使用紫色和蓝色系列
    const colors = [
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', // 紫色系
      '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', // 靛蓝系
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', // 重复紫色系
    ];
    
    const bgColor = colors[Math.abs(hash) % colors.length];
    
    // 生成几何图案
    const patterns = [];
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // 生成圆形图案
    for (let i = 0; i < 5; i++) {
      const x = random(hash + i) * 80 + 10;
      const y = random(hash + i + 10) * 80 + 10;
      const radius = random(hash + i + 20) * 15 + 5;
      const opacity = random(hash + i + 30) * 0.5 + 0.2;
      
      patterns.push({
        type: 'circle',
        x,
        y,
        radius,
        opacity,
        color: colors[(Math.abs(hash + i)) % colors.length]
      });
    }
    
    // 生成矩形图案
    for (let i = 0; i < 3; i++) {
      const x = random(hash + i + 50) * 60 + 10;
      const y = random(hash + i + 60) * 60 + 10;
      const width = random(hash + i + 70) * 20 + 10;
      const height = random(hash + i + 80) * 20 + 10;
      const opacity = random(hash + i + 90) * 0.4 + 0.2;
      
      patterns.push({
        type: 'rect',
        x,
        y,
        width,
        height,
        opacity,
        color: colors[(Math.abs(hash + i + 50)) % colors.length]
      });
    }
    
    return {
      bgColor,
      patterns
    };
  }, [address]);
  
  return (
    <div 
      className={`relative rounded-full overflow-hidden shadow-neon ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0"
      >
        {/* 背景 */}
        <rect
          width="100"
          height="100"
          fill={avatarData.bgColor}
        />
        
        {/* 图案 */}
        {avatarData.patterns.map((pattern, index) => {
          if (pattern.type === 'circle') {
            return (
              <circle
                key={index}
                cx={pattern.x}
                cy={pattern.y}
                r={pattern.radius}
                fill={pattern.color}
                opacity={pattern.opacity}
              />
            );
          } else {
            return (
              <rect
                key={index}
                x={pattern.x}
                y={pattern.y}
                width={pattern.width}
                height={pattern.height}
                fill={pattern.color}
                opacity={pattern.opacity}
                rx="4"
              />
            );
          }
        })}
        
        {/* 渐变覆盖层 */}
        <defs>
          <radialGradient id={`gradient-${address}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </radialGradient>
        </defs>
        <rect
          width="100"
          height="100"
          fill={`url(#gradient-${address})`}
        />
      </svg>
      
      {/* 边框 */}
      <div className="absolute inset-0 rounded-full border-2 border-monad-purple/30"></div>
    </div>
  );
}