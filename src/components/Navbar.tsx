import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Eye, Wallet, Menu, X, Zap, ChevronDown } from 'lucide-react';
import { truncateAddress } from '../utils/format';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
  activeTab: 'trade' | 'whale';
  onTabChange: (tab: 'trade' | 'whale') => void;
  walletConnected: boolean;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export default function Navbar({ activeTab, onTabChange, walletConnected, walletAddress, onConnectWallet }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: 'trade' as const, label: 'Trade',      icon: TrendingUp },
    { id: 'whale' as const, label: 'Whale Intel', icon: Eye },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-ww-border bg-white/90 backdrop-blur-xl shadow-[0_1px_0_#E4EAFF]">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <motion.button
          className="flex items-center"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onTabChange('trade')}
        >
          <img src="/logo.svg" alt="WhaleWatch" className="h-9 w-auto" />
        </motion.button>

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-0.5 rounded-xl bg-ww-bg border border-ww-border p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab.id ? 'text-ww-navy' : 'text-ww-muted hover:text-ww-navy-2'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-white shadow-card border border-ww-border"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <tab.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected = ready && account && chain;

              return (
                <div
                  className="flex items-center gap-3"
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <motion.button
                          onClick={openConnectModal}
                          className="btn-pink text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Wallet className="h-4 w-4" />
                          Connect Wallet
                        </motion.button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <motion.button
                          onClick={openChainModal}
                          className="btn-pink !bg-loss text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Wrong Network
                        </motion.button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        {/* Network selector pill */}
                        <motion.button
                          onClick={openChainModal}
                          className="hidden lg:flex items-center gap-2 rounded-xl border border-ww-border bg-ww-bg px-3 py-1.5 text-xs font-semibold text-ww-navy hover:bg-white transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: 'hidden',
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                          <ChevronDown className="h-3 w-3 text-ww-muted" />
                        </motion.button>

                        {/* Connected address wallet pill */}
                        <motion.button
                          onClick={openAccountModal}
                          className="btn-ghost !border-profit/40 !text-profit text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Zap className="h-4 w-4" />
                          {account.displayName}
                        </motion.button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {/* Mobile toggle */}
          <button
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-ww-border bg-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4 text-ww-navy" /> : <Menu className="h-4 w-4 text-ww-navy" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ww-border bg-white md:hidden"
          >
            <div className="space-y-1 p-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-dim text-blue font-semibold'
                      : 'text-ww-muted hover:bg-ww-bg'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
