import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { HOT_TOKENS } from '../data/mockData';
import { formatPercent } from '../utils/format';
import type { HotToken } from '../types';

interface TickerTapeProps {
  onSelectToken?: (token: HotToken) => void;
}

export default function TickerTape({ onSelectToken }: TickerTapeProps) {
  const tokens = [...HOT_TOKENS, ...HOT_TOKENS];

  return (
    <div className="relative border-b border-ww-border bg-ww-bg/80 backdrop-blur-sm overflow-hidden py-2">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-ww-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-ww-bg to-transparent" />

      <div className="ticker-wrapper">
        <div className="ticker-content">
          {tokens.map((token, i) => (
            <motion.span
              key={`${token.symbol}-${i}`}
              className="inline-flex items-center gap-2 px-5 cursor-pointer select-none py-1 hover:bg-ww-card-alt/60 rounded-lg transition-all"
              whileHover={{ y: -1, scale: 1.02 }}
              onClick={() => onSelectToken?.(token)}
            >
              <span className="text-xs font-bold text-ww-navy">{token.symbol}</span>
              <span className="font-mono text-xs text-ww-muted">
                ${token.price < 0.01 ? token.price.toFixed(8) : token.price.toFixed(4)}
              </span>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                token.change24h >= 0 ? 'text-profit' : 'text-loss'
              }`}>
                {token.change24h >= 0
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />}
                {formatPercent(token.change24h)}
              </span>
              <span className="text-ww-border-2 text-xs">|</span>
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
