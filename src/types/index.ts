// ===== Token Types =====
export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  chain: 'ethereum' | 'bsc' | 'solana';
  price: number;
  priceChange24h: number;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  txCount24h: number;
  holders?: number;
  logo?: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// ===== Security Scanner Types =====
export interface SecurityResult {
  safetyScore: number;
  isHoneypot: boolean;
  hasBlacklist: boolean;
  hasMintFunction: boolean;
  buyTax: number;
  sellTax: number;
  isOpenSource: boolean;
  isProxy: boolean;
  hasOwnershipRenounced: boolean;
  lpLocked: boolean;
  lpLockDuration?: string;
  creatorAddress?: string;
  warnings: string[];
}

// ===== Whale Intelligence Types =====
export interface WhaleTransaction {
  id: string;
  timestamp: number;
  chain: 'ethereum' | 'bsc';
  type: 'swap' | 'transfer';
  tokenSymbol: string;
  tokenName: string;
  tokenAmount: number;
  usdValue: number;
  walletAddress: string;
  txHash: string;
  direction: 'buy' | 'sell' | 'in' | 'out';
  tokenAddress?: string;
}

export interface WhaleStats {
  totalTransactions24h: number;
  totalVolumeETH: number;
  totalVolumeBNB: number;
  totalVolumeUSD: number;
  uniqueWhales: number;
  largestTx: WhaleTransaction | null;
}

// ===== Hot Token Types =====
export interface HotToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  logo?: string;
  chain: 'ethereum' | 'bsc' | 'solana';
  address: string;
}

// ===== Chain Type =====
export type Chain = 'ethereum' | 'bsc' | 'solana';

export interface ChainInfo {
  id: string;
  name: string;
  shortName: string;
  explorerUrl: string;
  nativeSymbol: string;
  color: string;
}
