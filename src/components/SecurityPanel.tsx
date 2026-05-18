import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Code2,
  Shield,
  Ban,
  Coins,
  ArrowDownUp,
} from 'lucide-react';
import SecurityGauge from './SecurityGauge';
import type { SecurityResult } from '../types';

interface SecurityPanelProps {
  data: SecurityResult;
}

export default function SecurityPanel({ data }: SecurityPanelProps) {
  const checks = [
    {
      label: 'Honeypot Risk',
      value: data.isHoneypot,
      danger: true,
      icon: Ban,
      desc: data.isHoneypot ? 'Token cannot be sold' : 'Token can be freely traded',
    },
    {
      label: 'Blacklist Function',
      value: data.hasBlacklist,
      danger: true,
      icon: Lock,
      desc: data.hasBlacklist ? 'Owner can blacklist addresses' : 'No blacklist mechanism',
    },
    {
      label: 'Mint Function',
      value: data.hasMintFunction,
      danger: true,
      icon: Coins,
      desc: data.hasMintFunction ? 'Owner can mint new tokens' : 'Supply is fixed',
    },
    {
      label: 'Open Source',
      value: data.isOpenSource,
      danger: false,
      icon: Code2,
      desc: data.isOpenSource ? 'Contract code is verified' : 'Contract is not verified',
    },
    {
      label: 'Ownership Renounced',
      value: data.hasOwnershipRenounced,
      danger: false,
      icon: Unlock,
      desc: data.hasOwnershipRenounced ? 'No owner control' : 'Owner has control',
    },
    {
      label: 'LP Locked',
      value: data.lpLocked,
      danger: false,
      icon: Shield,
      desc: data.lpLocked ? `Liquidity locked (${data.lpLockDuration})` : 'Liquidity is not locked',
    },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-dim text-pink">
          <Shield className="h-4 w-4" />
        </div>
        <h3 className="font-display text-lg font-bold text-ww-navy">Security Scanner</h3>
        <span className="ml-auto rounded-full bg-blue-dim border border-blue-glow px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue">
          Protect
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center py-4">
        <SecurityGauge score={data.safetyScore} />
      </div>

      {/* Tax Info */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-ww-card-alt border border-ww-border p-3 text-center transition-all hover:border-ww-border-2">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <ArrowDownUp className="h-3.5 w-3.5 text-profit" />
            <span className="text-xs font-semibold text-ww-muted">Buy Tax</span>
          </div>
          <span className={`font-mono text-xl font-bold ${data.buyTax > 5 ? 'text-loss' : 'text-profit'}`}>
            {data.buyTax}%
          </span>
        </div>
        <div className="rounded-xl bg-ww-card-alt border border-ww-border p-3 text-center transition-all hover:border-ww-border-2">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <ArrowDownUp className="h-3.5 w-3.5 text-loss" />
            <span className="text-xs font-semibold text-ww-muted">Sell Tax</span>
          </div>
          <span className={`font-mono text-xl font-bold ${data.sellTax > 5 ? 'text-loss' : 'text-profit'}`}>
            {data.sellTax}%
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {checks.map((check, i) => {
          const isSafe = check.danger ? !check.value : check.value;
          return (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="flex items-center gap-3 rounded-xl bg-ww-card-alt px-3 py-2.5 border border-ww-border transition-colors hover:border-ww-border-2 hover:bg-ww-bg"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-ww-border shadow-sm">
                 <check.icon className="h-3.5 w-3.5 text-ww-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ww-navy">{check.label}</p>
                <p className="text-[11px] font-medium text-ww-muted truncate">{check.desc}</p>
              </div>
              {isSafe ? (
                <CheckCircle2 className="h-5 w-5 text-profit flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-loss flex-shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.warnings.map((warning, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-xl bg-[#FFF5EB] border border-[#F5A62340] px-3 py-2.5"
            >
              <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-[#B87A14]">{warning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
