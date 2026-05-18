import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Layers,
  Percent,
  Wallet
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';
import { getTokenLogoUrl } from '../utils/format';
import type { Chain, HotToken } from '../types';

interface MarketsDashboardProps {
  onSelectToken: (token: HotToken) => void;
  onNavigateToTab: (tab: 'trade') => void;
}

export default function MarketsDashboard({ onSelectToken, onNavigateToTab }: MarketsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<'all' | Chain>('all');

  // Hardcoded curated list of top market cap / trending tokens matching CG/CMC
  const marketTokens = useMemo(() => {
    return [
      { id: '1', rank: 1, name: 'Ethereum', symbol: 'ETH', price: 3412.56, change24h: 3.42, volume24h: 18450000000, marketCap: 412500000000, chain: 'ethereum' as const, address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', sparkline: [3310, 3340, 3325, 3370, 3390, 3385, 3412.56] },
      { id: '2', rank: 2, name: 'Solana', symbol: 'SOL', price: 174.52, change24h: 5.43, volume24h: 4210000000, marketCap: 81200000000, chain: 'solana' as const, address: 'So11111111111111111111111111111111111111112', sparkline: [162, 165, 168, 166, 171, 172, 174.52] },
      { id: '3', rank: 3, name: 'BNB', symbol: 'BNB', price: 582.14, change24h: 1.15, volume24h: 1650000000, marketCap: 86400000000, chain: 'bsc' as const, address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', sparkline: [575, 578, 576, 580, 581, 579, 582.14] },
      { id: '4', rank: 4, name: 'Shiba Inu', symbol: 'SHIB', price: 0.00002156, change24h: -3.20, volume24h: 640000000, marketCap: 12800000000, chain: 'ethereum' as const, address: '0x95ad2e96fadf424e6518b374014a4e1d28e1d52a', sparkline: [0.0000225, 0.0000221, 0.0000219, 0.0000223, 0.0000217, 0.0000216, 0.00002156] },
      { id: '5', rank: 5, name: 'Pepe', symbol: 'PEPE', price: 0.00001247, change24h: 12.40, volume24h: 1230000000, marketCap: 5240000000, chain: 'ethereum' as const, address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', sparkline: [0.0000105, 0.0000112, 0.0000110, 0.0000115, 0.0000121, 0.0000120, 0.00001247] },
      { id: '6', rank: 6, name: 'dogwifhat', symbol: 'WIF', price: 2.34, change24h: 15.30, volume24h: 342000000, marketCap: 2340000000, chain: 'solana' as const, address: 'EKpQGSJtjMFqKZ9KQGWjh65KUYdugauUpEeWE1tXm9k', sparkline: [1.95, 2.05, 2.12, 2.08, 2.22, 2.28, 2.34] },
      { id: '7', rank: 7, name: 'Popcat', symbol: 'POPCAT', price: 1.45, change24h: 8.90, volume24h: 185000000, marketCap: 1450000000, chain: 'solana' as const, address: '7GCihJUkfj2th4mrTuJAhBXtXnFM4mR9G2yXPd8gjug6', sparkline: [1.31, 1.34, 1.39, 1.35, 1.41, 1.42, 1.45] },
      { id: '8', rank: 8, name: 'Dogecoin', symbol: 'DOGE', price: 0.1523, change24h: 4.60, volume24h: 924000000, marketCap: 22100000000, chain: 'bsc' as const, address: '0xba2ae6b24d039e4813ad9001392aa78eff378b871', sparkline: [0.142, 0.145, 0.148, 0.146, 0.151, 0.150, 0.1523] },
      { id: '9', rank: 9, name: 'Floki', symbol: 'FLOKI', price: 0.0001834, change24h: 8.70, volume24h: 215000000, marketCap: 1750000000, chain: 'bsc' as const, address: '0xfb5b2f5b331a4359bbab5580158c1ac22222222', sparkline: [0.000165, 0.000171, 0.000169, 0.000175, 0.000179, 0.000181, 0.0001834] },
      { id: '10', rank: 10, name: 'Brett', symbol: 'BRETT', price: 0.1245, change24h: 22.10, volume24h: 98000000, marketCap: 1245000000, chain: 'ethereum' as const, address: '0x24d039e4813ad9001392aa78eff378b871c890da893', sparkline: [0.098, 0.105, 0.110, 0.108, 0.118, 0.121, 0.1245] },
      { id: '11', rank: 11, name: 'Bonk', symbol: 'BONK', price: 0.00002789, change24h: -1.80, volume24h: 185000000, marketCap: 1950000000, chain: 'solana' as const, address: 'DezXAZ8z7PnrnESzzSJ4bF6PgRVwHTDFUC3ocqi3mJXC', sparkline: [0.0000291, 0.0000285, 0.0000288, 0.0000282, 0.0000286, 0.0000280, 0.00002789] },
      { id: '12', rank: 12, name: 'Neiro', symbol: 'NEIRO', price: 0.00156, change24h: 31.50, volume24h: 320000000, marketCap: 654000000, chain: 'ethereum' as const, address: '0x81e12DFd5293D8e347dFe59E90eFd55b2956a13439', sparkline: [0.00115, 0.00122, 0.00129, 0.00125, 0.00141, 0.00148, 0.00156] }
    ];
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'Total Market Cap', value: '$3.24T', change: 4.25, icon: Layers, color: 'text-blue', bg: 'bg-blue-dim' },
      { label: '24h Global Volume', value: '$124.6B', change: 12.80, icon: Activity, color: 'text-pink', bg: 'bg-pink-dim' },
      { label: 'Solana Dominance', value: '14.8%', change: 1.12, icon: Percent, color: 'text-profit', bg: 'bg-profit-dim' },
      { label: 'Active Whales (24h)', value: '12,852', change: -0.45, icon: Wallet, color: 'text-ww-navy', bg: 'bg-white/40' },
    ];
  }, []);

  const filteredTokens = useMemo(() => {
    return marketTokens.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.address.toLowerCase() === searchQuery.toLowerCase();
      const matchesChain = selectedChain === 'all' || t.chain === selectedChain;
      return matchesSearch && matchesChain;
    });
  }, [marketTokens, searchQuery, selectedChain]);

  const handleSelectToken = (token: typeof marketTokens[0]) => {
    onSelectToken({
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      change24h: token.change24h,
      chain: token.chain,
      address: token.address
    });
    onNavigateToTab('trade');
  };

  return (
    <div className="mx-auto max-w-[1440px] px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black tracking-tight text-ww-navy mb-2">
          DeFi Token Markets
        </h1>
        <p className="text-ww-muted font-medium text-lg">
          Live prices, 24h shifts, volumes, and direct trading options across all chains.
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex flex-col rounded-3xl border border-ww-border bg-white/70 p-6 shadow-sm backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold tracking-wider text-ww-muted uppercase">{stat.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-ww-navy">{stat.value}</span>
              <span className={`flex items-center text-xs font-bold ${stat.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                {stat.change >= 0 ? <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> : <TrendingDown className="mr-0.5 h-3.5 w-3.5" />}
                {formatPercent(Math.abs(stat.change))}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Chain Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'solana', 'ethereum', 'bsc'] as const).map(chain => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm ${
                selectedChain === chain
                  ? 'bg-blue text-white shadow-blue-glow'
                  : 'bg-white border border-ww-border text-ww-navy hover:bg-slate-50'
              }`}
            >
              {chain === 'all' ? '🔗 All Chains' : chain === 'solana' ? '☀️ Solana' : chain === 'ethereum' ? '🔮 Ethereum' : '🪙 BNB Chain'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-4 flex items-center text-ww-muted">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search symbol or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-ww-border bg-white py-3 pl-11 pr-4 text-sm font-semibold text-ww-navy placeholder:text-ww-muted shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
          />
        </div>
      </div>

      {/* Tokens Table Card */}
      <div className="overflow-hidden rounded-3xl border border-ww-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ww-border bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-ww-muted">
                <th className="py-4 px-6 text-center w-12">#</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">24h %</th>
                <th className="py-4 px-6">24h Volume</th>
                <th className="py-4 px-6">Market Cap</th>
                <th className="py-4 px-6 text-center">Last 7 Days</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ww-border">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token, idx) => {
                  const isPositive = token.change24h >= 0;
                  
                  return (
                    <tr key={token.id} className="hover:bg-slate-50/40 transition-colors font-medium">
                      {/* Rank */}
                      <td className="py-4 px-6 text-center text-ww-muted font-bold">
                        {idx + 1}
                      </td>

                      {/* Name & Symbol */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getTokenLogoUrl(token.chain, token.address) ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-ww-border shadow-sm p-1.5 flex-shrink-0">
                              <img 
                                src={getTokenLogoUrl(token.chain, token.address)} 
                                alt={token.symbol} 
                                className="h-full w-full object-contain rounded-md"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-xs font-black text-ww-navy">${token.symbol.charAt(0)}</span>`;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-pink text-sm font-black text-white shadow-sm flex-shrink-0">
                              {token.symbol.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-ww-navy leading-none">{token.name}</span>
                              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                                token.chain === 'solana' ? 'bg-purple-dim border-purple-glow text-purple' :
                                token.chain === 'ethereum' ? 'bg-blue-dim border-blue-glow text-blue' :
                                'bg-gold-dim border-gold-glow text-gold'
                              }`}>
                                {token.chain}
                              </span>
                            </div>
                            <span className="text-xs text-ww-muted font-semibold mt-1 block uppercase">${token.symbol}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 text-ww-navy font-bold">
                        {token.price < 0.01 ? `$${token.price.toFixed(8)}` : formatCurrency(token.price)}
                      </td>

                      {/* 24h % */}
                      <td className="py-4 px-6">
                        <span className={`flex items-center font-bold text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                          {isPositive ? <ArrowUpRight className="mr-0.5 h-4 w-4" /> : <ArrowDownRight className="mr-0.5 h-4 w-4" />}
                          {formatPercent(Math.abs(token.change24h))}
                        </span>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-4 px-6 text-ww-navy font-semibold text-sm">
                        {formatCurrency(token.volume24h)}
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-6 text-ww-navy font-semibold text-sm">
                        {formatCurrency(token.marketCap)}
                      </td>

                      {/* Last 7 Days Sparkline Chart */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-block h-10 w-28">
                          <svg className="h-full w-full overflow-visible">
                            <polyline
                              fill="none"
                              stroke={isPositive ? '#10B981' : '#EF4444'}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={token.sparkline
                                .map((val, i) => {
                                  const min = Math.min(...token.sparkline);
                                  const max = Math.max(...token.sparkline);
                                  const range = max - min || 1;
                                  const x = (i / (token.sparkline.length - 1)) * 112;
                                  const y = 35 - ((val - min) / range) * 30;
                                  return `${x},${y}`;
                                })
                                .join(' ')}
                            />
                          </svg>
                        </div>
                      </td>

                      {/* Action button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleSelectToken(token)}
                          className="rounded-xl bg-blue/10 border border-blue-glow/30 px-4 py-2 text-xs font-bold text-blue hover:bg-blue hover:text-white transition-all shadow-sm"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ww-muted font-bold">
                    No tokens found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
