import { motion } from 'framer-motion';
import { TrendingUp, Eye, Shield, ArrowRight, Activity, Zap, Compass, ChevronRight, Globe, Lock } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const features = [
    {
      title: 'Trade & Swap',
      description: 'Sleek, fluid interface integrated with top DEX aggregators to swap tokens instantly with advanced slippage settings.',
      icon: TrendingUp,
      badge: 'Aggregator',
      color: 'text-blue',
      bg: 'bg-blue-dim',
      border: 'border-blue/20',
    },
    {
      title: 'Track Whales',
      description: 'A live block-scanning pipeline that parses actual on-chain blocks to intercept and log whale swaps and large token movements in real-time.',
      icon: Eye,
      badge: 'Live Scanner',
      color: 'text-pink',
      bg: 'bg-pink-dim',
      border: 'border-pink/20',
    },
    {
      title: 'Protect Assets',
      description: 'Comprehensive smart contract security audit checking honeypots, LP locks, mint parameters, and ownership renouncements in one tap.',
      icon: Shield,
      badge: 'Audit Engine',
      color: 'text-profit',
      bg: 'bg-profit-dim',
      border: 'border-profit/20',
    },
  ];

  const stats = [
    { label: 'Tracking Volume', value: '$2.4B+' },
    { label: 'Monitored Blocks', value: '12.8M+' },
    { label: 'Active Whale Wallets', value: '45,000+' },
    { label: 'Scanned Contracts', value: '150,000+' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-ww-bg dot-grid flex flex-col justify-between">
      {/* Ambient gradient backgrounds */}
      <div className="blob-pink top-[-100px] left-[-150px] opacity-70" />
      <div className="blob-blue top-[200px] right-[-200px] opacity-75" />
      <div className="blob-pink bottom-[-100px] left-[20%] opacity-60" />

      {/* Header / Navbar */}
      <header className="relative z-20 w-full border-b border-ww-border bg-white/70 backdrop-blur-xl py-4 px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/whale-icon.svg" alt="WhaleWatch" className="h-8 w-auto md:hidden" />
          <img src="/logo.svg" alt="WhaleWatch" className="hidden md:block h-10 w-auto" />
        </div>
        <div>
          <motion.button
            onClick={onEnterApp}
            className="btn-pink flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm group shadow-pink-glow whitespace-nowrap"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>
              <span className="inline sm:hidden">Launch</span>
              <span className="hidden sm:inline">Launch Terminal</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </motion.button>
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="relative z-10 flex-grow max-w-[1440px] mx-auto px-6 py-16 lg:py-24 flex flex-col justify-center items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl flex flex-col items-center"
        >
          {/* Subheading / Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-dim border border-blue-glow px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue">
              <Zap className="h-3.5 w-3.5 animate-pulse" /> Next-Gen DeFi Intelligence
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-ww-navy leading-none mb-6"
          >
            Trade. Track. <span className="gradient-text">Protect.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-ww-muted font-medium max-w-2xl leading-relaxed mb-10"
          >
            Whale Watch is a sophisticated, mature Web3 intelligence and trading terminal that keeps you steps ahead. Monitor live block-level whale transfers, swap seamlessly across chains, and scan smart contracts for hidden exploits.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
            <motion.button
              onClick={onEnterApp}
              className="btn-pink !px-8 !py-4 text-base font-bold shadow-pink-glow group flex items-center gap-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <a
              href="#features"
              className="btn-ghost !px-8 !py-4 text-base font-bold flex items-center justify-center gap-2 border-ww-border-2"
            >
              Explore Intelligence
              <ChevronRight className="h-5 w-5" />
            </a>
          </motion.div>

          {/* Grid Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-5xl rounded-3xl bg-white border border-ww-border shadow-card p-6 md:p-10 mb-24"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-extrabold text-ww-navy mb-2">{stat.value}</p>
                <p className="text-xs md:text-sm font-semibold text-ww-muted tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <div id="features" className="w-full max-w-6xl mt-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-ww-navy mb-3">Institutional-Grade Suite</h2>
            <p className="text-sm font-semibold text-ww-muted uppercase tracking-widest">Designed for Professional Capital and Trading Operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -5 }}
                className="card p-8 border hover:border-ww-border-2 transition-all hover:shadow-card-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} border ${feature.border} shadow-sm`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold tracking-wider ${feature.bg} ${feature.color}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ww-navy mb-3">{feature.title}</h3>
                  <p className="text-sm font-medium text-ww-muted leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-blue hover:text-pink transition-colors cursor-pointer group">
                  Learn more <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust banner */}
        <div className="w-full max-w-5xl mt-24 border-t border-ww-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-display text-lg font-bold text-ww-navy mb-1 flex items-center gap-2">
              <Lock className="h-4 w-4 text-pink" /> Built For Maximum Security
            </h4>
            <p className="text-xs font-semibold text-ww-muted max-w-md">
              Our open-source terminal prioritizes secure execution. Connect any web3 wallet safely without private key exposure.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-ww-muted uppercase tracking-widest">
              <Globe className="h-4 w-4 text-blue" /> Supports
            </div>
            <div className="flex items-center gap-4">
              <span className="badge-purple font-mono text-[11px] font-bold">Ethereum Mainnet</span>
              <span className="badge-gold font-mono text-[11px] font-bold">BNB Smart Chain</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-ww-border bg-white/40 backdrop-blur-md mt-16 w-full">
        <div className="mx-auto max-w-[1440px] flex flex-col items-center justify-between gap-3 px-8 py-6 sm:flex-row">
          <p className="text-xs font-semibold text-ww-muted">
            © 2025 WhaleWatch · Professional DeFi Intelligence Terminal.
          </p>
          <p className="text-[10px] font-bold text-ww-muted/60 uppercase tracking-widest">
            For educational purposes only · No financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
