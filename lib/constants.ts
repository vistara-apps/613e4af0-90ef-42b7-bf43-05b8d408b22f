export const SUPPORTED_CURRENCIES = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
];

export const MAX_COLLABORATORS = 3;
export const MIN_COLLABORATORS = 2;
export const TRANSACTION_FEE_PERCENTAGE = 2; // 2% fee

export const ANIMATION_DURATION = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;
