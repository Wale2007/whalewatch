import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Droplets,
  BarChart3,
  Activity,
  Users,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import SecurityPanel from '../components/SecurityPanel';
import SwapPanel from '../components/SwapPanel';
import { SkeletonCard, SkeletonChart } from '../components/Skeletons';
import { MOCK_TOKEN, MOCK_SECURITY, generateCandleData } from '../data/mockData';
import { formatCurrency, formatNumber, formatPercent, truncateAddress } from '../utils/format';
import type { TokenData, SecurityResult, CandleData, Chain, HotToken } from '../types';

interface TradeDashboardProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
  selectedToken: HotToken | null;
  onSelectToken: (token: HotToken | null) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function TradeDashboard({ walletConnected, onConnectWallet, selectedToken, onSelectToken }: TradeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<Chain>('ethereum');
  const [isLoading, setIsLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [securityData, setSecurityData] = useState<SecurityResult | null>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [copied, setCopied] = useState(false);

  // Load token data on mount OR when selectedToken prop changes
  useEffect(() => {
    setIsLoading(true);
    const targetToken = selectedToken || {
      symbol: 'PEPE',
      name: 'Pepe',
      price: 0.00001247,
      change24h: 12.4,
      chain: 'ethereum' as const,
      address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    };

    setSearchQuery(targetToken.address);
    setSelectedChain(targetToken.chain);

    const timer = setTimeout(() => {
      setTokenData({
        name: targetToken.name,
        symbol: targetToken.symbol,
        address: targetToken.address,
        chain: targetToken.chain,
        price: targetToken.price,
        priceChange24h: targetToken.change24h,
        marketCap: targetToken.symbol === 'PEPE' ? 5240000000 : targetToken.symbol === 'SHIB' ? 12800000000 : 850000000,
        liquidity: targetToken.symbol === 'PEPE' ? 82400000 : 156000000,
        volume24h: targetToken.symbol === 'PEPE' ? 1230000000 : 640000000,
        txCount24h: 48523,
        holders: targetToken.symbol === 'PEPE' ? 234567 : 1245000,
      });
      setSecurityData(MOCK_SECURITY);
      setCandleData(generateCandleData(14));
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [selectedToken]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onSelectToken(null); // Clear selected token to prevent state mismatch
      setTokenData({
        name: 'Custom Asset',
        symbol: 'CUSTOM',
        address: searchQuery,
        chain: selectedChain,
        price: 1.0,
        priceChange24h: 0,
        marketCap: 10000000,
        liquidity: 500000,
        volume24h: 20000,
        txCount24h: 150,
        holders: 1200,
      });
      setSecurityData(MOCK_SECURITY);
      setCandleData(generateCandleData(14));
      setIsLoading(false);
    }, 800);
  };

  const handleCopyAddress = () => {
    if (tokenData) {
      navigator.clipboard.writeText(tokenData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statCards = useMemo(() => {
    if (!tokenData) return [];
    return [
      { label: 'Price', value: formatCurrency(tokenData.price), change: tokenData.priceChange24h, icon: DollarSign, color: 'text-blue', bg: 'bg-blue-dim' },
      { label: 'Market Cap', value: formatCurrency(tokenData.marketCap, true), icon: BarChart3, color: 'text-pink', bg: 'bg-pink-dim' },
      { label: 'Liquidity', value: formatCurrency(tokenData.liquidity, true), icon: Droplets, color: 'text-cyan', bg: 'bg-cyan/10' },
      { label: '24h Volume', value: formatCurrency(tokenData.volume24h, true), icon: Activity, color: 'text-profit', bg: 'bg-profit-dim' },
      { label: '24h Txns', value: formatNumber(tokenData.txCount24h, 0), icon: TrendingUp, color: 'text-gold', bg: 'bg-gold-dim' },
      { label: 'Holders', value: formatNumber(tokenData.holders || 0, 0), icon: Users, color: 'text-purple', bg: 'bg-purple-dim' },
    ];
  }, [tokenData]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      {/* Search Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="card p-2 shadow-card-md">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value as Chain)}
                className="w-full h-full appearance-none rounded-xl border-none bg-ww-card-alt px-4 py-3.5 pr-10 text-sm font-bold text-ww-navy outline-none cursor-pointer"
              >
                <option value="ethereum">Ethereum</option>
                <option value="bsc">BNB Chain</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ww-muted pointer-events-none" />
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ww-muted" />
              <input
                type="text"
                placeholder="Paste token contract address (0x...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-full rounded-xl border border-transparent bg-ww-card-alt py-3.5 pl-12 pr-4 text-[15px] font-mono text-ww-navy placeholder-ww-muted/60 outline-none transition-all focus:bg-white focus:border-blue focus:ring-4 focus:ring-blue-dim"
              />
            </div>

            <button onClick={handleSearch} className="btn-blue whitespace-nowrap px-8 py-3.5 text-[15px]">
              Analyze
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonChart className="lg:col-span-2" />
            <SkeletonCard />
          </div>
        </div>
      ) : tokenData ? (
        <>
          {/* Token Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-pink text-2xl font-bold text-white shadow-pink-glow">
                  {tokenData.symbol.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-ww-navy">{tokenData.name}</h2>
                    <span className="badge-blue border border-blue-glow">${tokenData.symbol}</span>
                    <span className={`badge-${tokenData.chain === 'ethereum' ? 'purple' : 'gold'}`}>
                      {tokenData.chain === 'ethereum' ? 'ERC-20' : 'BEP-20'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-ww-muted bg-ww-card-alt px-2 py-0.5 rounded-md border border-ww-border">
                      {truncateAddress(tokenData.address, 8, 6)}
                    </span>
                    <button onClick={handleCopyAddress} className="text-ww-muted hover:text-blue transition-colors p-1">
                      {copied ? <Check className="h-4 w-4 text-profit" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <a
                      href={`https://${tokenData.chain === 'ethereum' ? 'etherscan.io' : 'bscscan.com'}/token/${tokenData.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ww-muted hover:text-blue transition-colors p-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <span className="stat-label mb-1">Live Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold tracking-tight text-ww-navy">
                    {formatCurrency(tokenData.price)}
                  </span>
                  <span className={`flex items-center gap-1 font-bold ${tokenData.priceChange24h >= 0 ? 'badge-profit' : 'badge-loss'}`}>
                    {tokenData.priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {formatPercent(tokenData.priceChange24h)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="card-hover p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${stat.bg}`}>
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <p className="stat-value">{stat.value}</p>
                {'change' in stat && stat.change !== undefined && (
                  <span className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold ${stat.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {stat.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercent(stat.change)} (24h)
                  </span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div className="card p-5">
                <div className="relative rounded-2xl border border-ww-border overflow-hidden bg-ww-card-alt" style={{ height: '450px' }}>
                  <iframe
                    src={`https://dexscreener.com/${tokenData.chain === 'ethereum' ? 'ethereum' : 'bsc'}/${tokenData.address}?embed=1&theme=light&trades=0&info=0`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title={`${tokenData.name} Price Chart`}
                  />
                </div>
              </div>

              <div className="lg:hidden">
                <SwapPanel tokenSymbol={tokenData.symbol} tokenPrice={tokenData.price} chain={tokenData.chain} walletConnected={walletConnected} onConnectWallet={onConnectWallet} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="hidden lg:block">
                <SwapPanel tokenSymbol={tokenData.symbol} tokenPrice={tokenData.price} chain={tokenData.chain} walletConnected={walletConnected} onConnectWallet={onConnectWallet} />
              </div>
              {securityData && <SecurityPanel data={securityData} />}
            </motion.div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
