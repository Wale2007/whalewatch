import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface SecurityGaugeProps {
  score: number;
  size?: number;
}

export default function SecurityGauge({ score, size = 180 }: SecurityGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75; // 270-degree arc
  const center = size / 2;

  const getColor = (score: number) => {
    if (score >= 80) return { primary: '#00E676', glow: 'rgba(0, 230, 118, 0.4)' };
    if (score >= 60) return { primary: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' };
    if (score >= 40) return { primary: '#FF9500', glow: 'rgba(255, 149, 0, 0.4)' };
    return { primary: '#FF3366', glow: 'rgba(255, 51, 102, 0.4)' };
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Safe';
    if (score >= 60) return 'Moderate';
    if (score >= 40) return 'Caution';
    return 'Danger';
  };

  const getIcon = (score: number) => {
    if (score >= 80) return ShieldCheck;
    if (score >= 60) return Shield;
    if (score >= 40) return ShieldAlert;
    return ShieldX;
  };

  const color = getColor(score);
  const label = getLabel(score);
  const Icon = getIcon(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        className="gauge-ring -rotate-[135deg]"
        style={{ filter: `drop-shadow(0 0 12px ${color.glow})` }}
      >
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
        />
        {/* Animated score arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color.primary}
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Icon className="h-6 w-6 mb-1" style={{ color: color.primary }} />
        </motion.div>
        <motion.span
          className="font-grotesk text-3xl font-bold"
          style={{ color: color.primary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-xs font-medium text-white/40 uppercase tracking-wider mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
