/**
 * Format a number as currency with appropriate precision
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  }

  if (value < 0.01) {
    return `$${value.toFixed(8)}`;
  }
  if (value < 1) {
    return `$${value.toFixed(4)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a large number with abbreviations
 */
export function formatNumber(value: number, decimals = 2): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Truncate a wallet address
 */
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format a timestamp as a relative time
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Format a timestamp as a date string
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Get the explorer URL for a transaction
 */
export function getExplorerTxUrl(chain: 'ethereum' | 'bsc', txHash: string): string {
  const base = chain === 'ethereum' ? 'https://etherscan.io' : 'https://bscscan.com';
  return `${base}/tx/${txHash}`;
}

/**
 * Get the explorer URL for a wallet
 */
export function getExplorerAddressUrl(chain: 'ethereum' | 'bsc', address: string): string {
  const base = chain === 'ethereum' ? 'https://etherscan.io' : 'https://bscscan.com';
  return `${base}/address/${address}`;
}

/**
 * Get color class based on value (positive/negative)
 */
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-accent-green';
  if (value < 0) return 'text-accent-red';
  return 'text-white/60';
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get dynamic token logo URL from DexScreener by chain and address.
 * If only symbol is available (e.g. in transaction tables), it searches a map of known memecoins.
 */
/**
 * Get dynamic token logo URL from highly comprehensive DeFi CDNs.
 * - Solana tokens are queried from Jupiter's official open logo CDN.
 * - Ethereum / BSC tokens are queried from 1inch's open public token logo CDN.
 */
export function getTokenLogoUrl(
  chainOrSymbol: 'ethereum' | 'bsc' | 'solana' | string,
  address?: string
): string {
  // If address and chain is provided, resolve directly via elite DeFi CDNs (Jupiter / 1inch)
  if (address) {
    const cleanAddress = address.trim();
    if (chainOrSymbol === 'solana') {
      return `https://cdn.jupiter.ag/tokens/${cleanAddress}.png`;
    }
    // Ethereum / BSC / general EVM chains use 1inch dynamic CDN
    return `https://tokens.1inch.io/${cleanAddress.toLowerCase()}.png`;
  }

  // If only symbol is provided (e.g. for Whale Intel feed)
  const symbolUpper = chainOrSymbol.toUpperCase();
  
  // Dynamic native chain logo URLs
  if (symbolUpper === 'ETH' || symbolUpper === 'WETH') {
    return 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png';
  }
  if (symbolUpper === 'BNB' || symbolUpper === 'WBNB') {
    return 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png';
  }
  if (symbolUpper === 'SOL' || symbolUpper === 'WSOL') {
    return 'https://cdn.jupiter.ag/tokens/So11111111111111111111111111111111111111112.png';
  }

  // Hot memecoin addresses lookup
  const knownAddresses: Record<string, { chain: 'ethereum' | 'bsc' | 'solana'; address: string }> = {
    PEPE: { chain: 'ethereum', address: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
    SHIB: { chain: 'ethereum', address: '0x95ad2e96fadf424e6518b374014a4e1d28e1d52a' },
    FLOKI: { chain: 'bsc', address: '0xfb5b2f5b331a4359bbab5580158c1ac22222222' },
    WIF: { chain: 'solana', address: 'EKpQGSJtjMFqKZ9KQGWjh65KUYdugauUpEeWE1tXm9k' },
    BONK: { chain: 'solana', address: 'DezXAZ8z7PnrnESzzSJ4bF6PgRVwHTDFUC3ocqi3mJXC' },
    POPCAT: { chain: 'solana', address: '7GCihJUkfj2th4mrTuJAhBXtXnFM4mR9G2yXPd8gjug6' },
    DOGE: { chain: 'bsc', address: '0xba2ae6b24d039e4813ad9001392aa78eff378b871' },
    BRETT: { chain: 'ethereum', address: '0x24d039e4813ad9001392aa78eff378b871c890da893' },
    NEIRO: { chain: 'ethereum', address: '0x81e12dfd5293d8e347dfe59e90efd55b2956a13439' },
  };

  const known = knownAddresses[symbolUpper];
  if (known) {
    if (known.chain === 'solana') {
      return `https://cdn.jupiter.ag/tokens/${known.address}.png`;
    }
    return `https://tokens.1inch.io/${known.address.toLowerCase()}.png`;
  }

  return '';
}

