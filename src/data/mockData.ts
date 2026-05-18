import type { HotToken, TokenData, SecurityResult, WhaleTransaction, WhaleStats, CandleData, ChainInfo } from '../types';

// ===== Chain Info =====
export const CHAINS: Record<string, ChainInfo> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    explorerUrl: 'https://etherscan.io',
    nativeSymbol: 'ETH',
    color: '#627EEA',
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    shortName: 'BSC',
    explorerUrl: 'https://bscscan.com',
    nativeSymbol: 'BNB',
    color: '#F0B90B',
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    explorerUrl: 'https://solscan.io',
    nativeSymbol: 'SOL',
    color: '#9945FF',
  },
};

// ===== Hot Tokens =====
export const HOT_TOKENS: HotToken[] = [
  { symbol: 'SOL', name: 'Solana', price: 174.52, change24h: 5.4, chain: 'solana', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'WIF', name: 'dogwifhat', price: 2.34, change24h: 15.3, chain: 'solana', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  { symbol: 'BONK', name: 'Bonk', price: 0.00002789, change24h: -1.8, chain: 'solana', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { symbol: 'POPCAT', name: 'Popcat', price: 1.45, change24h: 8.9, chain: 'solana', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' },
  { symbol: 'PEPE', name: 'Pepe', price: 0.00001247, change24h: 12.4, chain: 'ethereum', address: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
  { symbol: 'SHIB', name: 'Shiba Inu', price: 0.00002156, change24h: -3.2, chain: 'ethereum', address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce' },
  { symbol: 'FLOKI', name: 'Floki', price: 0.0001834, change24h: 8.7, chain: 'bsc', address: '0xfb5b838b6cfeedc2873ab27866079ac55363d37e' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1523, change24h: 4.6, chain: 'bsc', address: '0xba2ae424d960c26247dd6c32edc70b295c744c43' },
  { symbol: 'BRETT', name: 'Brett', price: 0.1245, change24h: 22.1, chain: 'ethereum', address: '0x532f27101965dd16442e59d40670faf5ebb142e4' },
  { symbol: 'NEIRO', name: 'Neiro', price: 0.00156, change24h: 31.5, chain: 'ethereum', address: '0x812ba41e071c7b7fa4ebcfb62df5f45f6fa853ee' },
];

// ===== Mock Token Data =====
export const MOCK_TOKEN: TokenData = {
  name: 'Pepe',
  symbol: 'PEPE',
  address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  chain: 'ethereum',
  price: 0.00001247,
  priceChange24h: 12.4,
  marketCap: 5240000000,
  liquidity: 82400000,
  volume24h: 1230000000,
  txCount24h: 48523,
  holders: 234567,
};

// ===== Mock Security Data =====
export const MOCK_SECURITY: SecurityResult = {
  safetyScore: 82,
  isHoneypot: false,
  hasBlacklist: false,
  hasMintFunction: false,
  buyTax: 0,
  sellTax: 0,
  isOpenSource: true,
  isProxy: false,
  hasOwnershipRenounced: true,
  lpLocked: true,
  lpLockDuration: '365 days',
  creatorAddress: '0x1234...abcd',
  warnings: ['High concentration of tokens in top 10 wallets'],
};

// ===== Generate Mock Candle Data =====
export function generateCandleData(days: number = 30): CandleData[] {
  const data: CandleData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = 0.00001100;

  for (let i = days * 24; i >= 0; i--) {
    const time = now - i * 3600;
    const volatility = 0.03 + Math.random() * 0.05;
    const trend = Math.sin(i / 48) * 0.02;
    const change = (Math.random() - 0.48 + trend) * volatility;

    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    const volume = 500000 + Math.random() * 2000000;

    data.push({ time, open, high, low, close, volume });
    price = close;
  }

  return data;
}

// ===== Mock Whale Transactions =====
export function generateWhaleTransactions(count: number = 50): WhaleTransaction[] {
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'PEPE', name: 'Pepe' },
    { symbol: 'SHIB', name: 'Shiba Inu' },
    { symbol: 'LINK', name: 'Chainlink' },
    { symbol: 'UNI', name: 'Uniswap' },
    { symbol: 'AAVE', name: 'Aave' },
    { symbol: 'ARB', name: 'Arbitrum' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  ];

  const wallets = [
    '0x28C6c06298d514Db089934071355E5743bf21d60',
    '0x21a31Ee1afC51d94C2eFcCAa2093aD1322a81e12',
    '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d',
    '0x56Eddb7aa87536c09CCc2793473599fD21A8b17F',
    '0xF977814e90dA44bFA03b6295A0616a897441aceC',
    '0x1B3cB81E51011b549d78bf720b0d924ac763A7C2',
    '0x8894E0a0c962CB723c1ef8A1b3f2b4eb8f8e4e28',
    '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
  ];

  const now = Date.now();
  const transactions: WhaleTransaction[] = [];
  const tokenAddresses: Record<string, string> = {
    ETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    BNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    PEPE: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    SHIB: '0x95ad2e96fadf424e6518b374014a4e1d28e1d52a',
    LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    AAVE: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    ARB: '0xb50c6cf5093997d89053f29ac7f2a1b52a420b79',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  };

  for (let i = 0; i < count; i++) {
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const isSwap = Math.random() > 0.4;
    const chain = Math.random() > 0.45 ? 'ethereum' : 'bsc' as const;
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    const usdValue = 100000 + Math.random() * 9900000;
    const directions = isSwap ? ['buy', 'sell'] as const : ['in', 'out'] as const;
    const direction = directions[Math.floor(Math.random() * 2)];

    let tokenAmount: number;
    if (token.symbol === 'ETH') tokenAmount = usdValue / 3200;
    else if (token.symbol === 'BNB') tokenAmount = usdValue / 580;
    else if (token.symbol === 'WBTC') tokenAmount = usdValue / 67000;
    else if (token.symbol === 'USDC') tokenAmount = usdValue;
    else tokenAmount = usdValue / (Math.random() * 100 + 0.01);

    transactions.push({
      id: `tx-${i}-${Math.random().toString(36).substring(7)}`,
      timestamp: now - Math.floor(Math.random() * 86400000),
      chain,
      type: isSwap ? 'swap' : 'transfer',
      tokenSymbol: token.symbol,
      tokenName: token.name,
      tokenAmount,
      usdValue,
      walletAddress: wallet,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      direction,
      tokenAddress: tokenAddresses[token.symbol],
    });
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

// ===== Mock Whale Stats =====
export function generateWhaleStats(transactions: WhaleTransaction[]): WhaleStats {
  const totalVolumeUSD = transactions.reduce((sum, tx) => sum + tx.usdValue, 0);
  const ethTxs = transactions.filter(tx => tx.chain === 'ethereum');
  const bscTxs = transactions.filter(tx => tx.chain === 'bsc');
  const uniqueWallets = new Set(transactions.map(tx => tx.walletAddress));
  const largest = transactions.reduce((max, tx) => tx.usdValue > (max?.usdValue || 0) ? tx : max, transactions[0]);

  return {
    totalTransactions24h: transactions.length,
    totalVolumeETH: ethTxs.reduce((sum, tx) => sum + tx.usdValue, 0) / 3200,
    totalVolumeBNB: bscTxs.reduce((sum, tx) => sum + tx.usdValue, 0) / 580,
    totalVolumeUSD,
    uniqueWhales: uniqueWallets.size,
    largestTx: largest,
  };
}
