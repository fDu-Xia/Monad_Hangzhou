import { NextRequest, NextResponse } from 'next/server';

// 搜索结果类型定义
interface SearchResult {
  type: 'address' | 'transaction' | 'block' | 'token';
  value: string;
  label: string;
  description?: string;
  verified?: boolean;
  tags?: string[];
}

// 搜索API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query) {
      return NextResponse.json(
        { error: '搜索查询不能为空' },
        { status: 400 }
      );
    }
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const results: SearchResult[] = [];
    
    // 检查是否为地址格式
    if (query.match(/^0x[a-fA-F0-9]{40}$/)) {
      results.push({
        type: 'address',
        value: query,
        label: `${query.slice(0, 6)}...${query.slice(-4)}`,
        description: '钱包地址',
        verified: true,
        tags: ['地址']
      });
    }
    
    // 检查是否为交易哈希格式
    if (query.match(/^0x[a-fA-F0-9]{64}$/)) {
      results.push({
        type: 'transaction',
        value: query,
        label: `${query.slice(0, 10)}...${query.slice(-6)}`,
        description: '交易哈希',
        verified: true,
        tags: ['交易']
      });
    }
    
    // 检查是否为区块号
    if (query.match(/^\d+$/)) {
      const blockNumber = parseInt(query);
      if (blockNumber > 0 && blockNumber < 20000000) {
        results.push({
          type: 'block',
          value: query,
          label: `区块 #${query}`,
          description: '区块号',
          verified: true,
          tags: ['区块']
        });
      }
    }
    
    // 模糊搜索常见代币
    const tokens = [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000' },
      { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441c8C7c7b0b8b0b8b0b8b0b8b0b8b' },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
      { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
      { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
      { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
      { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
      { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' }
    ];
    
    const matchingTokens = tokens.filter(token => 
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.name.toLowerCase().includes(query.toLowerCase())
    );
    
    matchingTokens.forEach(token => {
      results.push({
        type: 'token',
        value: token.address,
        label: `${token.symbol} - ${token.name}`,
        description: '代币合约',
        verified: true,
        tags: ['代币', token.symbol]
      });
    });
    
    // 模糊搜索知名地址
    const knownAddresses = [
      {
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        label: 'Vitalik Buterin',
        description: '以太坊创始人',
        tags: ['知名人士', 'ETH创始人']
      },
      {
        address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        label: 'Uniswap Universal Router',
        description: 'Uniswap路由合约',
        tags: ['DeFi', 'Uniswap']
      },
      {
        address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        label: 'Uniswap V2 Router',
        description: 'Uniswap V2路由合约',
        tags: ['DeFi', 'Uniswap']
      }
    ];
    
    const matchingAddresses = knownAddresses.filter(addr =>
      addr.label.toLowerCase().includes(query.toLowerCase()) ||
      addr.description.toLowerCase().includes(query.toLowerCase()) ||
      addr.address.toLowerCase().includes(query.toLowerCase())
    );
    
    matchingAddresses.forEach(addr => {
      results.push({
        type: 'address',
        value: addr.address,
        label: addr.label,
        description: addr.description,
        verified: true,
        tags: addr.tags
      });
    });
    
    // 如果没有精确匹配，尝试将查询作为地址处理
    if (results.length === 0 && query.length >= 10) {
      results.push({
        type: 'address',
        value: query,
        label: query.length > 20 ? `${query.slice(0, 6)}...${query.slice(-4)}` : query,
        description: '可能的地址或用户名',
        verified: false,
        tags: ['搜索结果']
      });
    }
    
    // 限制结果数量
    const limitedResults = results.slice(0, limit);
    
    return NextResponse.json({
      success: true,
      data: {
        query,
        results: limitedResults,
        total: limitedResults.length,
        hasMore: results.length > limit
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('搜索时出错:', error);
    return NextResponse.json(
      { error: '搜索服务暂时不可用' },
      { status: 500 }
    );
  }
}

// 获取搜索建议
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: '查询参数不能为空' },
        { status: 400 }
      );
    }
    
    // 根据类型返回不同的建议
    const suggestions = [];
    
    if (type === 'address' || !type) {
      suggestions.push(
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
      );
    }
    
    if (type === 'token' || !type) {
      suggestions.push('ETH', 'USDC', 'USDT', 'DAI', 'UNI', 'LINK');
    }
    
    const filteredSuggestions = suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    return NextResponse.json({
      success: true,
      data: {
        query,
        suggestions: filteredSuggestions
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取搜索建议时出错:', error);
    return NextResponse.json(
      { error: '获取建议失败' },
      { status: 500 }
    );
  }
}