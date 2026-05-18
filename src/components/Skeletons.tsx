import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="skeleton h-4 w-24 mb-4 rounded" />
      <div className="skeleton h-8 w-32 mb-3 rounded" />
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="skeleton h-4 w-32 mb-4 rounded" />
      <div className="skeleton h-[300px] w-full rounded-xl" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="skeleton h-4 w-40 mb-4 rounded" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="skeleton h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-2.5 w-2/3 rounded" />
            </div>
            <div className="skeleton h-6 w-20 rounded" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGauge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="skeleton h-[180px] w-[180px] rounded-full" />
    </div>
  );
}
