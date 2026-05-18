import { useState, useEffect, useMemo } from 'react';

interface TokenLogoProps {
  chain: string;
  address?: string;
  symbol: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TokenLogo({ chain, address, symbol, className, size = 'md' }: TokenLogoProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Generate fallback list of CDNs based on the chain
  const urls = useMemo(() => {
    if (!address) return [];
    const cleanAddress = address.trim();
    const lowerAddress = cleanAddress.toLowerCase();
    
    // Solana URLs fallback cascade
    if (chain === 'solana') {
      return [
        `https://cdn.jupiter.ag/tokens/${cleanAddress}.png`,
        `https://token-list.jup.ag/images/solana/${cleanAddress}.png`,
        `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${cleanAddress}/logo.png`,
        `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${lowerAddress}/logo.png`
      ];
    }
    
    // EVM URLs fallback cascade
    const chainPath = chain === 'ethereum' ? 'ethereum' : 'smartchain';
    return [
      `https://tokens.1inch.io/${lowerAddress}.png`,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainPath}/assets/${cleanAddress}/logo.png`,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainPath}/assets/${lowerAddress}/logo.png`,
      `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${cleanAddress}/logo.png`,
      `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${lowerAddress}/logo.png`,
      `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/${chain === 'ethereum' ? 'ethereum' : 'bsc'}/${cleanAddress}.png`,
      `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/${chain === 'ethereum' ? 'ethereum' : 'bsc'}/${lowerAddress}.png`,
      `https://tokens.pancakeswap.finance/images/${lowerAddress}.png`
    ];
  }, [chain, address]);

  useEffect(() => {
    setFallbackIndex(0);
    if (urls.length > 0) {
      setImgSrc(urls[0]);
    } else {
      setImgSrc('');
    }
  }, [urls]);

  const handleError = () => {
    if (fallbackIndex + 1 < urls.length) {
      setFallbackIndex(prev => prev + 1);
      setImgSrc(urls[fallbackIndex + 1]);
    } else {
      setImgSrc(''); // Exhausted all options, fall back to letter avatar
    }
  };

  const defaultClasses = size === 'sm' ? 'h-10 w-10 p-1 rounded-xl' : size === 'lg' ? 'h-16 w-16 p-1.5 rounded-2xl' : 'h-12 w-12 p-1 rounded-xl';

  if (imgSrc) {
    return (
      <div className={`flex items-center justify-center bg-white border border-ww-border shadow-sm flex-shrink-0 ${className || defaultClasses}`}>
        <img
          src={imgSrc}
          alt={symbol}
          className="h-full w-full object-contain rounded-md"
          onError={handleError}
        />
      </div>
    );
  }

  // Beautiful fallback CSS gradient letter avatar
  const avatarClasses = size === 'sm' ? 'h-10 w-10 text-xs font-black' : size === 'lg' ? 'h-16 w-16 text-2xl font-bold shadow-pink-glow' : 'h-12 w-12 text-base font-bold shadow-md';
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-blue to-pink text-white flex-shrink-0 rounded-xl ${className || avatarClasses}`}>
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}
