import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Settings, ChevronDown, Zap, AlertCircle, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

interface SwapPanelProps {
  tokenSymbol: string;
  tokenPrice: number;
  chain: 'ethereum' | 'bsc';
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export default function SwapPanel({ tokenSymbol, tokenPrice, chain, walletConnected, onConnectWallet }: SwapPanelProps) {
  const [isBuy, setIsBuy] = useState(true);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  // Swapping states
  const [swapping, setSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState('');

  // Wagmi hooks to fetch live connected wallet balances
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const nativeSymbol = chain === 'ethereum' ? 'ETH' : 'BNB';
  const nativePrice = chain === 'ethereum' ? 3200 : 580;

  // Formatted real wallet balance (Wagmi v2 returns BigInt value + decimals)
  const formattedBalance = balanceData ? formatUnits(balanceData.value, balanceData.decimals) : '0';
  const liveNativeBalance = balanceData ? parseFloat(formattedBalance) : 0;
  const liveNativeBalanceString = balanceData ? parseFloat(formattedBalance).toFixed(4) : '0.0000';

  // Buy state uses native balance, sell state uses simulated token balance (user starts with 0 new tokens)
  const activeBalance = isBuy ? liveNativeBalance : 0;
  const activeBalanceString = isBuy ? liveNativeBalanceString : '0.00';
  const activeBalanceSymbol = isBuy ? nativeSymbol : tokenSymbol;

  // Insufficient balance checker
  const isInsufficient = walletConnected && fromAmount && parseFloat(fromAmount) > activeBalance;

  const toAmount = fromAmount
    ? isBuy
      ? ((parseFloat(fromAmount) * nativePrice) / tokenPrice).toFixed(2)
      : ((parseFloat(fromAmount) * tokenPrice) / nativePrice).toFixed(6)
    : '';

  const handleSwapExecute = () => {
    if (!fromAmount || swapping || isInsufficient) return;
    setSwapping(true);
    setSwapSuccess(false);

    // Simulate smart contract router and block inclusion
    setTimeout(() => {
      setSwapping(false);
      setSwapSuccess(true);
      const mockHash = chain === 'ethereum'
        ? '0xe4e29780004944ec5b77c5ef442b58dcdcdcd00010992aa78eff378b871c890d'
        : '0xad32ba55d6768393e506692aa78eff378b871c890da8933e92aa78eff378b871';
      setSwapTxHash(mockHash);
      setFromAmount('');
    }, 2000);
  };

  const explorerUrl = chain === 'ethereum'
    ? `https://etherscan.io/tx/${swapTxHash}`
    : `https://bscscan.com/tx/${swapTxHash}`;

  return (
    <div className="relative">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-dim text-blue">
              <ArrowDownUp className="h-4 w-4" />
            </div>
            <h3 className="font-display text-lg font-bold text-ww-navy">Swap</h3>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-lg p-2 transition-colors hover:bg-ww-card-alt border border-transparent hover:border-ww-border"
          >
            <Settings className="h-4 w-4 text-ww-muted" />
          </button>
        </div>

        {/* Slippage Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-xl bg-ww-card-alt border border-ww-border p-3 shadow-inner">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ww-muted mb-2">Slippage Tolerance</p>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0, 3.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        slippage === val
                          ? 'bg-blue border border-blue text-white shadow-blue-glow'
                          : 'bg-white border border-ww-border text-ww-muted hover:border-ww-border-2 hover:text-ww-navy'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buy/Sell Toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-ww-card-alt border border-ww-border mb-4 shadow-inner">
          <button
            onClick={() => setIsBuy(true)}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
              isBuy
                ? 'bg-white text-profit shadow-sm border border-ww-border'
                : 'text-ww-muted hover:text-ww-navy'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setIsBuy(false)}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
              !isBuy
                ? 'bg-white text-loss shadow-sm border border-ww-border'
                : 'text-ww-muted hover:text-ww-navy'
            }`}
          >
            Sell
          </button>
        </div>

        {/* From Input */}
        <div className="rounded-xl bg-ww-card-alt border border-ww-border p-4 mb-2 transition-all focus-within:border-blue focus-within:ring-2 focus-within:ring-blue-dim">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ww-muted">From</span>
            <span className="text-[11px] font-semibold text-ww-muted">
              Balance: {walletConnected ? `${activeBalanceString} ${activeBalanceSymbol}` : '0.00'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-display font-bold text-ww-navy placeholder-ww-border-2 outline-none"
            />
            <div className="flex items-center gap-2 rounded-lg bg-white border border-ww-border px-3 py-1.5 shadow-sm">
              <div className={`h-5 w-5 rounded-full shadow-sm ${chain === 'ethereum' ? 'bg-[#627EEA]' : 'bg-[#F0B90B]'}`} />
              <span className="text-sm font-bold text-ww-navy">{isBuy ? nativeSymbol : tokenSymbol}</span>
              <ChevronDown className="h-3 w-3 text-ww-muted" />
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-3 relative z-10">
          <motion.button
            onClick={() => setIsBuy(!isBuy)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-ww-border bg-white shadow-card hover:border-ww-border-2 text-blue hover:text-pink transition-colors"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowDownUp className="h-4 w-4" />
          </motion.button>
        </div>

        {/* To Input */}
        <div className="rounded-xl bg-ww-card-alt border border-ww-border p-4 mt-2 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ww-muted">To (estimated)</span>
            <span className="text-[11px] font-semibold text-ww-muted">Balance: 0.00</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="0.00"
              value={toAmount}
              readOnly
              className="flex-1 bg-transparent text-2xl font-display font-bold text-ww-navy/50 placeholder-ww-border-2 outline-none"
            />
            <div className="flex items-center gap-2 rounded-lg bg-white border border-ww-border px-3 py-1.5 shadow-sm">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue to-pink shadow-sm" />
              <span className="text-sm font-bold text-ww-navy">{isBuy ? tokenSymbol : nativeSymbol}</span>
              <ChevronDown className="h-3 w-3 text-ww-muted" />
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-xl bg-ww-card-alt border border-ww-border p-3 mb-4 space-y-1.5"
          >
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-ww-muted">Rate</span>
              <span className="text-ww-navy font-mono">
                1 {nativeSymbol} = {(nativePrice / tokenPrice).toFixed(2)} {tokenSymbol}
              </span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-ww-muted">Slippage</span>
              <span className="text-ww-navy font-mono">{slippage}%</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-ww-muted">Est. Gas</span>
              <span className="text-ww-navy font-mono">~$4.20</span>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {walletConnected ? (
          isInsufficient ? (
            <motion.button
              disabled
              className="w-full rounded-xl py-3.5 font-bold text-white bg-loss/40 cursor-not-allowed shadow-card"
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Insufficient Balance
              </div>
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSwapExecute}
              disabled={!fromAmount || swapping}
              className={`w-full rounded-xl py-3.5 font-bold text-white transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed ${
                isBuy ? 'bg-profit' : 'bg-loss'
              }`}
              whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                {swapping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Routing via Uniswap pool...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    {fromAmount ? (isBuy ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`) : 'Enter Amount'}
                  </>
                )}
              </div>
            </motion.button>
          )
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <motion.button
                onClick={openConnectModal}
                disabled={!mounted}
                className="btn-blue w-full py-3.5 text-[15px]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect Wallet to Swap
              </motion.button>
            )}
          </ConnectButton.Custom>
        )}

        {/* Disclaimer */}
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-dim border border-blue-glow px-3 py-2.5">
          <AlertCircle className="h-4 w-4 text-blue flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue leading-relaxed">
            Swap execution via DEX aggregator. Always verify token contracts and set appropriate slippage.
          </p>
        </div>
      </div>

      {/* Floating Transaction Receipt Notification */}
      <AnimatePresence>
        {swapSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute left-0 right-0 -bottom-24 z-30 rounded-2xl border border-profit/40 bg-profit-dim p-4 shadow-card-md"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-profit leading-none mb-1">Transaction Confirmed!</p>
                <p className="text-[11px] font-medium text-ww-navy/70 leading-normal">
                  Successfully completed swap. Swapped native into your active token contract.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-profit flex items-center gap-1 hover:underline uppercase tracking-wider"
                  >
                    View on Block Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSwapSuccess(false)}
                className="text-profit/60 hover:text-profit text-xs font-bold px-2 py-1 rounded hover:bg-profit/10"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
