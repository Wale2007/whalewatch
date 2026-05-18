import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Activity,
  Waves,
  Users,
  TrendingUp,
  ArrowDownUp,
  ExternalLink,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SkeletonTable, SkeletonCard } from '../components/Skeletons';
import { scanWhaleTransactions, type ScanResult } from '../services/whaleScanner';
import { generateWhaleStats } from '../data/mockData';
import TokenLogo from '../components/TokenLogo';
import {
  formatCurrency,
  formatNumber,
  truncateAddress,
  timeAgo,
  getExplorerTxUrl,
  getExplorerAddressUrl,
} from '../utils/format';
import type { WhaleTransaction, WhaleStats } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function WhaleIntelDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState<WhaleStats | null>(null);
  const [filterChain, setFilterChain] = useState<'all' | 'ethereum' | 'bsc'>('all');
  const [filterType, setFilterType] = useState<'all' | 'swap' | 'transfer'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await scanWhaleTransactions();
      setScanResult(result);
      setStats(generateWhaleStats(result.transactions));
    } catch (error) {
      console.error("Failed to load whale transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await scanWhaleTransactions();
      setScanResult(result);
      setStats(generateWhaleStats(result.transactions));
    } catch (error) {
       console.error("Failed to refresh whale transactions:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const transactions = scanResult?.transactions || [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterChain !== 'all' && tx.chain !== filterChain) return false;
      if (filterType !== 'all' && tx.type !== filterType) return false;
      return true;
    });
  }, [transactions, filterChain, filterType]);

  // Chart data for pie chart
  const pieData = useMemo(() => {
    const swaps = transactions.filter((tx) => tx.type === 'swap').length;
    const transfers = transactions.filter((tx) => tx.type === 'transfer').length;
    return [
      { name: 'DEX Swaps', value: swaps, color: '#1652F0' },
      { name: 'Transfers', value: transfers, color: '#FF2D78' },
    ];
  }, [transactions]);

  // Chart data for volume bar chart
  const volumeData = useMemo(() => {
    const hours: Record<string, { hour: string; swapVolume: number; transferVolume: number }> = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const hourKey = `${date.getHours().toString().padStart(2, '0')}:00`;
      if (!hours[hourKey]) {
        hours[hourKey] = { hour: hourKey, swapVolume: 0, transferVolume: 0 };
      }
      if (tx.type === 'swap') {
        hours[hourKey].swapVolume += tx.usdValue;
      } else {
        hours[hourKey].transferVolume += tx.usdValue;
      }
    });
    return Object.values(hours).sort((a, b) => a.hour.localeCompare(b.hour)).slice(0, 12);
  }, [transactions]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Whale Txns (24h)', value: stats.totalTransactions24h.toString(), icon: Activity, color: 'text-blue', bg: 'bg-blue-dim' },
      { label: 'Total Volume', value: formatCurrency(stats.totalVolumeUSD, true), icon: TrendingUp, color: 'text-profit', bg: 'bg-profit-dim' },
      { label: 'ETH Volume', value: `${formatNumber(stats.totalVolumeETH)} ETH`, icon: Waves, color: 'text-[#627EEA]', bg: 'bg-[#627EEA]/10' },
      { label: 'Unique Whales', value: stats.uniqueWhales.toString(), icon: Users, color: 'text-purple', bg: 'bg-purple-dim' },
    ];
  }, [stats]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-pink shadow-blue-glow">
              <Eye className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ww-navy mb-1">Whale Intelligence</h2>
              <div className="flex items-center gap-2">
                 <p className="text-sm font-medium text-ww-muted">Real-time on-chain whale activity</p>
                  {scanResult?.source === 'live-blockchain' ? (
                    <span className="badge-profit">
                      <ShieldCheck className="h-3 w-3 mr-1"/> Live Block Scan
                    </span>
                  ) : (
                    <span className="badge-blue">
                      <ShieldCheck className="h-3 w-3 mr-1"/> Verified History
                    </span>
                  )}
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-ghost flex items-center gap-2 px-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
          </motion.button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonTable rows={8} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="card-hover p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="stat-label">{stat.label}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="stat-value text-3xl">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Largest Transaction Banner */}
          {stats?.largestTx && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="card p-5 border-gold/30 bg-gradient-to-r from-gold/5 to-transparent relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                <div className="flex flex-wrap items-center gap-4 relative z-10">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold-dim border border-gold/20 shadow-sm">
                    <Crown className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-1">Largest Transaction (24h)</p>
                    <div className="flex items-baseline gap-3">
                       <p className="font-display text-2xl font-bold text-ww-navy">
                         {formatCurrency(stats.largestTx.usdValue, true)}
                       </p>
                       <span className="text-sm font-semibold text-ww-muted">
                          {formatNumber(stats.largestTx.tokenAmount)} {stats.largestTx.tokenSymbol}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`badge-${stats.largestTx.chain === 'ethereum' ? 'purple' : 'gold'}`}>
                      {stats.largestTx.chain === 'ethereum' ? 'Ethereum' : 'BNB Chain'}
                    </span>
                    <span className="font-medium text-ww-muted">{timeAgo(stats.largestTx.timestamp)}</span>
                    <a
                       href={getExplorerTxUrl(stats.largestTx.chain, stats.largestTx.txHash)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="btn-ghost !px-3 !py-1.5"
                    >
                       View Tx <ExternalLink className="h-3.5 w-3.5 ml-1"/>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-dim text-blue">
                   <BarChart3 className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-ww-navy">Volume by Hour</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RechartsBarChart data={volumeData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4EAFF" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: '#6B7A9F', fontSize: 12, fontWeight: 500 }} axisLine={{ stroke: '#E4EAFF' }} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: '#6B7A9F', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`} dx={-10} />
                  <Tooltip
                    cursor={{ fill: '#F4F7FF' }}
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #E4EAFF', borderRadius: '12px', boxShadow: '0 4px 20px rgba(10,15,30,0.08)', color: '#0A0F1E', fontSize: '13px', fontWeight: 600 }}
                    formatter={(value: number) => [formatCurrency(value, true), '']}
                  />
                  <Bar dataKey="swapVolume" name="DEX Swaps" fill="#1652F0" radius={[4, 4, 0, 0] as any} maxBarSize={40} />
                  <Bar dataKey="transferVolume" name="Transfers" fill="#FF2D78" radius={[4, 4, 0, 0] as any} maxBarSize={40} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-dim text-pink">
                   <ArrowDownUp className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-ww-navy">Transaction Types</h3>
              </div>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
                       contentStyle={{ background: '#FFFFFF', border: '1px solid #E4EAFF', borderRadius: '12px', boxShadow: '0 4px 20px rgba(10,15,30,0.08)', color: '#0A0F1E', fontSize: '13px', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-8 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-ww-muted">{item.name}</span>
                      <span className="text-sm font-bold text-ww-navy">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters & Table */}
          <motion.div variants={itemVariants} className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-ww-border bg-ww-card-alt/50">
               <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center gap-2 mr-2">
                   <Filter className="h-4 w-4 text-ww-muted" />
                   <span className="text-sm font-bold text-ww-navy">Filters</span>
                 </div>

                 <div className="flex gap-1 rounded-xl bg-white border border-ww-border p-1 shadow-sm">
                   {[{ value: 'all', label: 'All Chains' }, { value: 'ethereum', label: 'Ethereum' }, { value: 'bsc', label: 'BSC' }].map((opt) => (
                     <button
                       key={opt.value}
                       onClick={() => setFilterChain(opt.value as any)}
                       className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                         filterChain === opt.value ? 'bg-blue text-white shadow-md' : 'text-ww-muted hover:text-ww-navy hover:bg-ww-card-alt'
                       }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                 </div>

                 <div className="flex gap-1 rounded-xl bg-white border border-ww-border p-1 shadow-sm">
                   {[{ value: 'all', label: 'All Types' }, { value: 'swap', label: 'DEX Swaps' }, { value: 'transfer', label: 'Transfers' }].map((opt) => (
                     <button
                       key={opt.value}
                       onClick={() => setFilterType(opt.value as any)}
                       className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                         filterType === opt.value ? 'bg-pink text-white shadow-md' : 'text-ww-muted hover:text-ww-navy hover:bg-ww-card-alt'
                       }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                 </div>
               </div>

               <span className="text-sm font-semibold text-ww-muted">
                 Showing <span className="text-ww-navy">{filteredTransactions.length}</span> txns
               </span>
            </div>

            <div className="overflow-x-auto">
              <table className="ww-table w-full whitespace-nowrap">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Chain</th>
                    <th>Type</th>
                    <th>Token</th>
                    <th>Amount</th>
                    <th>USD Value</th>
                    <th>Wallet</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(0, 30).map((tx, i) => (
                    <motion.tr key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                      <td><span className="text-sm font-medium text-ww-muted">{timeAgo(tx.timestamp)}</span></td>
                      <td>
                        <span className={`badge-${tx.chain === 'ethereum' ? 'purple' : 'gold'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tx.chain === 'ethereum' ? 'bg-[#7C3AED]' : 'bg-[#F5A623]'}`} />
                          {tx.chain === 'ethereum' ? 'Ethereum' : 'BSC'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-${tx.type === 'swap' ? 'blue' : 'pink'}`}>
                          {tx.type === 'swap' ? <Zap className="h-3 w-3" /> : <ArrowDownUp className="h-3 w-3" />}
                          {tx.type === 'swap' ? 'Swap' : 'Transfer'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <TokenLogo
                            chain={tx.chain}
                            address={tx.tokenAddress}
                            symbol={tx.tokenSymbol}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-bold text-ww-navy">{tx.tokenSymbol}</p>
                            <p className="text-[11px] font-medium text-ww-muted">{tx.tokenName}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {tx.direction === 'buy' || tx.direction === 'in' ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-profit-dim text-profit"><ArrowUpRight className="h-3 w-3" /></div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-loss-dim text-loss"><ArrowDownRight className="h-3 w-3" /></div>
                          )}
                          <span className="font-mono text-sm font-semibold text-ww-navy">{formatNumber(tx.tokenAmount)}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-sm font-bold ${tx.usdValue >= 1000000 ? 'text-gold' : 'text-ww-navy'}`}>
                          {formatCurrency(tx.usdValue, true)}
                        </span>
                      </td>
                      <td>
                        <a href={getExplorerAddressUrl(tx.chain, tx.walletAddress)} target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] font-medium text-blue hover:underline">
                          {truncateAddress(tx.walletAddress)}
                        </a>
                      </td>
                      <td className="text-right">
                        <a href={getExplorerTxUrl(tx.chain, tx.txHash)} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5 inline-flex">
                          View <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
             {scanResult?.source === 'verified-fallback' && (
                <div className="bg-blue-dim p-3.5 text-center border-t border-blue-glow">
                   <p className="text-xs font-semibold text-blue flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-4 w-4"/>
                      Currently displaying verified recent transaction history from block logs. Blockexplorer links are active and functional.
                   </p>
                </div>
             )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
