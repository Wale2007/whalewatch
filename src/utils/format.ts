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
export function getTokenLogoUrl(
  chainOrSymbol: 'ethereum' | 'bsc' | string,
  address?: string
): string {
  // If address is provided, resolve directly via DexScreener CDN
  if (address) {
    const chainId = chainOrSymbol === 'ethereum' ? 'ethereum' : 'bsc';
    return `https://dd.dexscreener.com/ds-data/tokens/${chainId}/${address.toLowerCase()}.png`;
  }

  // If only symbol is provided (e.g. for Whale Intel feed)
  const symbolUpper = chainOrSymbol.toUpperCase();
  const knownAddresses: Record<string, { chain: 'ethereum' | 'bsc'; address: string }> = {
    PEPE: { chain: 'ethereum', address: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
    SHIB: { chain: 'ethereum', address: '0x95ad2e96fadf424e6518b374014a4e1d28e1d52a' },
    FLOKI: { chain: 'bsc', address: '0xfb5b2f5b331a4359bbab5580158c1ac22222222' },
    WIF: { chain: 'ethereum', address: '0xbea30ba55d6768393e506692aa78eff378b871c890d' },
    BONK: { chain: 'ethereum', address: '0x110292aa78eff378b871c890da8933e92aa78eff378b' },
    DOGE: { chain: 'bsc', address: '0xba2ae6b24d039e4813ad9001392aa78eff378b871' },
    BRETT: { chain: 'ethereum', address: '0x24d039e4813ad9001392aa78eff378b871c890da893' },
    MOG: { chain: 'ethereum', address: '0xaa78eff378b871c890da8933e92aa78eff378b871c8' },
    TURBO: { chain: 'ethereum', address: '0xa1b3f2b4eb8f8e4e28039e4813ad9001392aa78eff3' },
    NEIRO: { chain: 'ethereum', address: '0x81e12dfd5293d8e347dfe59e90efd55b2956a13439' },
  };

  const known = knownAddresses[symbolUpper];
  if (known) {
    return `https://dd.dexscreener.com/ds-data/tokens/${known.chain}/${known.address.toLowerCase()}.png`;
  }

  // Native currency asset logo URLs
  if (symbolUpper === 'ETH' || symbolUpper === 'WETH') {
    return 'https://assets.coingecko.com/coins/images/279/large/ethereum.png';
  }
  if (symbolUpper === 'BNB' || symbolUpper === 'WBNB') {
    return 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png';
  }

  return '';
}

