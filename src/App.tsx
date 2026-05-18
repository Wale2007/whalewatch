import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import TickerTape from './components/TickerTape';
import TradeDashboard from './pages/TradeDashboard';
import WhaleIntelDashboard from './pages/WhaleIntelDashboard';
import LandingPage from './pages/LandingPage';
import { useAccount } from 'wagmi';

import type { HotToken } from './types';

type ActiveTab = 'trade' | 'whale';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('trade');
  const [selectedHotToken, setSelectedHotToken] = useState<HotToken | null>(null);
  const { isConnected, address } = useAccount();

  const handleConnectWallet = () => {
    // Handled natively by RainbowKit modals
  };

  if (showLanding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage onEnterApp={() => setShowLanding(false)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative min-h-screen bg-ww-bg text-ww-navy dot-grid">
      {/* Ambient glow orbs */}
      <div className="blob-pink top-[-200px] left-[-150px]" />
      <div className="blob-blue top-[100px] right-[-200px]" />
      <div className="blob-pink bottom-[10%] left-[30%]" style={{ opacity: 0.5 }} />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'trade' && activeTab === 'trade') {
            // Return to landing page if they click Logo when already on Trade tab
            setShowLanding(true);
          } else {
            setActiveTab(tab);
          }
        }}
        walletConnected={isConnected}
        walletAddress={address || null}
        onConnectWallet={handleConnectWallet}
      />

      {/* Hot Tokens Ticker */}
      <TickerTape onSelectToken={(token) => {
        setSelectedHotToken(token);
        setShowLanding(false);
        setActiveTab('trade');
      }} />

      {/* Page Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'trade' ? (
            <motion.div
              key="trade"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TradeDashboard
                walletConnected={isConnected}
                onConnectWallet={handleConnectWallet}
                selectedToken={selectedHotToken}
                onSelectToken={setSelectedHotToken}
              />
            </motion.div>
          ) : (
            <motion.div
              key="whale"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WhaleIntelDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-ww-border bg-white/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-8 py-6 sm:flex-row">
          <p className="text-sm font-medium text-ww-muted">
            © 2025 WhaleWatch · Trade. Track. Protect.
          </p>
          <p className="text-xs font-semibold text-ww-muted/60 uppercase tracking-widest">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
