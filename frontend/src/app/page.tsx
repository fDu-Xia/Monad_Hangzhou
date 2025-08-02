'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/user/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-ambient-gradient min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-monad-border bg-monad-darker bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">
                Trustonic
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-16 relative flex-1">
        {/* Logo Section */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <h2 className="text-8xl font-bold gradient-text">Trustonic</h2>
            <span className="text-6xl text-monad-text-secondary">×</span>
            <div className="flex items-center">
              <Image 
                src="/method-draw-image.svg" 
                alt="MONAD Logo" 
                width={64} 
                height={64} 
                className="rounded-md mr-3"
              />
              <h2 className="text-8xl font-bold text-white">MONAD</h2>
            </div>
          </div>
          <div className="mb-8">
            <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-monad-purple via-monad-blue to-monad-purple animate-pulse-slow">
              Trust Up, All Up
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-monad-text-muted" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-monad-darker border border-monad-border text-monad-text-primary rounded-full focus:outline-none focus:ring-2 focus:ring-monad-purple focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-14 h-14 bg-monad-purple hover:bg-opacity-90 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-neon hover:shadow-lg"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </form>

        {/* Demo Addresses
        <div className="w-full max-w-4xl mb-24">
          <h3 className="text-xl font-semibold text-white text-center mb-6">体验不同类型的用户数据</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/user/0x1234567890abcdef1234567890abcdef12345678')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-monad-purple font-medium">巨鲸用户</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0x1234...5678</p>
              <p className="text-monad-text-muted text-xs mt-1">高价值交易，DeFi专家</p>
            </button>
            
            <button
              onClick={() => router.push('/user/0xabcdef1234567890abcdef1234567890abcdef12')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-blue-400 font-medium">专业交易者</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0xabcd...ef12</p>
              <p className="text-monad-text-muted text-xs mt-1">频繁交易，多协议参与</p>
            </button>
            
            <button
              onClick={() => router.push('/user/0x9876543210fedcba9876543210fedcba98765432')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 font-medium">活跃用户</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0x9876...5432</p>
              <p className="text-monad-text-muted text-xs mt-1">定期交易，DeFi参与者</p>
            </button>
            
            <button
              onClick={() => router.push('/user/0xfedcba0987654321fedcba0987654321fedcba09')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-yellow-400 font-medium">普通用户</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0xfedc...ba09</p>
              <p className="text-monad-text-muted text-xs mt-1">偶尔交易，基础操作</p>
            </button>
            
            <button
              onClick={() => router.push('/user/0x1111222233334444555566667777888899990000')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-orange-400 font-medium">新手用户</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0x1111...0000</p>
              <p className="text-monad-text-muted text-xs mt-1">刚开始使用，小额交易</p>
            </button>
            
            <button
              onClick={() => router.push('/user/0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')}
              className="p-4 bg-monad-darker border border-monad-border rounded-lg hover:border-monad-purple transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-400 font-medium text-lg">随机地址</span>
              </div>
              <p className="text-monad-text-secondary text-sm">0xaaaa...aaaa</p>
              <p className="text-monad-text-muted text-xs mt-1">随机生成的用户数据</p>
            </button>
          </div>
        </div> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-monad-border py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold gradient-text mb-2">Trustonic</h2>
              <p className="text-monad-text-muted text-sm">© 2024 Trustonic. </p>
            </div>
            <div className="flex space-x-6">
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
