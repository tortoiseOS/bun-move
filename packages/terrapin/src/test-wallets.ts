/**
 * Pre-configured test wallet presets for Sui blockchain testing
 *
 * Use these to quickly set up wallets with specific balances and assets
 * for testing different scenarios.
 */

export interface TestWalletBalance {
  /** SUI token amount in MIST (1 SUI = 1,000,000,000 MIST) */
  SUI?: number;
  /** USDC amount (in smallest unit, typically 6 decimals) */
  USDC?: number;
  /** USDT amount */
  USDT?: number;
  /** Custom tokens */
  [token: string]: number | undefined;
}

export interface TestWalletNFT {
  /** NFT collection name */
  collection: string;
  /** Token ID */
  id?: string;
  /** NFT attributes */
  attributes?: Record<string, any>;
}

export interface TestWalletConfig {
  /** Wallet nickname for easy reference */
  name: string;
  /** Wallet description */
  description?: string;
  /** Token balances */
  balances: TestWalletBalance;
  /** NFTs owned by this wallet */
  nfts?: TestWalletNFT[];
  /** Whether wallet is used for gas sponsorship */
  isGasSponsor?: boolean;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Pre-configured test wallets
 *
 * These wallets come with realistic balances for different test scenarios
 */
export const TEST_WALLETS: Record<string, TestWalletConfig> = {
  /**
   * Whale wallet - Large holder for testing high-value operations
   */
  whale: {
    name: 'Whale',
    balances: {
      SUI: 1_000_000_000_000_000, // 1,000,000 SUI
      USDC: 500_000_000_000, // 500,000 USDC
      USDT: 250_000_000_000, // 250,000 USDT
    },
    nfts: [
      { collection: 'Premium Collection', id: '1', attributes: { rarity: 'legendary' } },
      { collection: 'Premium Collection', id: '2', attributes: { rarity: 'legendary' } },
    ],
    isGasSponsor: true,
    metadata: {
      description: 'High-balance wallet for testing large transactions',
    },
  },

  /**
   * Normie wallet - Average user for standard testing
   */
  normie: {
    name: 'Normie',
    balances: {
      SUI: 100_000_000_000, // 100 SUI
      USDC: 50_000_000, // 50 USDC
      USDT: 25_000_000, // 25 USDT
    },
    nfts: [{ collection: 'Common Collection', attributes: { rarity: 'common' } }],
    metadata: {
      description: 'Standard wallet for typical user testing',
    },
  },

  /**
   * Degen wallet - Active trader for testing swap/DeFi operations
   */
  degen: {
    name: 'Degen',
    balances: {
      SUI: 10_000_000_000, // 10 SUI
      USDC: 5_000_000_000, // 5,000 USDC
      USDT: 5_000_000_000, // 5,000 USDT
    },
    metadata: {
      description: 'Active trader wallet for DeFi testing',
    },
  },

  /**
   * Poor wallet - Low balance for testing edge cases
   */
  poor: {
    name: 'Poor',
    balances: {
      SUI: 500_000_000, // 0.5 SUI (minimal balance)
      USDC: 100_000, // 0.1 USDC
    },
    metadata: {
      description: 'Low-balance wallet for testing insufficient funds scenarios',
    },
  },

  /**
   * Empty wallet - No balance for testing zero-state UX
   */
  empty: {
    name: 'Empty',
    balances: {},
    metadata: {
      description: 'Empty wallet for testing zero-balance states',
    },
  },

  /**
   * NFT Collector - Wallet with many NFTs
   */
  nftCollector: {
    name: 'NFT Collector',
    balances: {
      SUI: 50_000_000_000, // 50 SUI
      USDC: 10_000_000_000, // 10,000 USDC
    },
    nfts: [
      { collection: 'Art Collection', id: '101', attributes: { rarity: 'rare', artist: 'Alice' } },
      { collection: 'Art Collection', id: '102', attributes: { rarity: 'common', artist: 'Bob' } },
      { collection: 'Gaming NFTs', id: '201', attributes: { level: 50, class: 'warrior' } },
      { collection: 'Gaming NFTs', id: '202', attributes: { level: 30, class: 'mage' } },
      { collection: 'PFP Collection', id: '301', attributes: { trait: 'laser-eyes' } },
    ],
    metadata: {
      description: 'Wallet with diverse NFT collection for testing NFT operations',
    },
  },

  /**
   * Gas Sponsor - Wallet specifically for gas sponsorship testing
   */
  gasSponsor: {
    name: 'Gas Sponsor',
    balances: {
      SUI: 10_000_000_000_000, // 10,000 SUI (for gas)
    },
    isGasSponsor: true,
    metadata: {
      description: 'Gas sponsor wallet for testing sponsored transactions',
    },
  },

  /**
   * Staker wallet - Wallet with staked positions
   */
  staker: {
    name: 'Staker',
    balances: {
      SUI: 500_000_000_000, // 500 SUI
      USDC: 100_000_000_000, // 100,000 USDC
    },
    metadata: {
      description: 'Wallet with staked positions for testing staking/yield',
      stakedSUI: 250_000_000_000, // 250 SUI staked
      stakedUSDC: 50_000_000_000, // 50,000 USDC staked
    },
  },

  /**
   * Multi-token wallet - Wallet with many different tokens
   */
  multiToken: {
    name: 'Multi-Token',
    balances: {
      SUI: 100_000_000_000, // 100 SUI
      USDC: 50_000_000_000, // 50,000 USDC
      USDT: 50_000_000_000, // 50,000 USDT
      DAI: 25_000_000_000, // 25,000 DAI
      WETH: 10_000_000_000, // 10 WETH (example)
      WBTC: 500_000_000, // 0.5 WBTC (example)
    },
    metadata: {
      description: 'Wallet with diverse token holdings for testing multi-token operations',
    },
  },
};

/**
 * Helper to convert SUI amount to MIST
 * 1 SUI = 1,000,000,000 MIST
 */
export function suiToMist(sui: number): number {
  return sui * 1_000_000_000;
}

/**
 * Helper to convert MIST to SUI
 */
export function mistToSui(mist: number): number {
  return mist / 1_000_000_000;
}

/**
 * Helper to format balance for display
 */
export function formatBalance(amount: number, token: string = 'SUI', decimals: number = 9): string {
  const value = (amount / Math.pow(10, decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${value} ${token}`;
}

/**
 * Create a custom test wallet
 *
 * @example
 * const myWallet = createTestWallet({
 *   name: 'My Test Wallet',
 *   balances: {
 *     SUI: suiToMist(1000),
 *     USDC: 50_000_000_000
 *   }
 * });
 */
export function createTestWallet(config: Partial<TestWalletConfig>): TestWalletConfig {
  return {
    name: config.name || 'Custom Wallet',
    description: config.description,
    balances: config.balances || {},
    nfts: config.nfts || [],
    isGasSponsor: config.isGasSponsor || false,
    metadata: config.metadata || {},
  };
}

/**
 * Get wallet by name
 */
export function getTestWallet(name: keyof typeof TEST_WALLETS): TestWalletConfig {
  const wallet = TEST_WALLETS[name];
  if (!wallet) {
    throw new Error(`Test wallet "${name}" not found. Available wallets: ${Object.keys(TEST_WALLETS).join(', ')}`);
  }
  return wallet;
}

/**
 * List all available test wallets
 */
export function listTestWallets(): string[] {
  return Object.keys(TEST_WALLETS);
}

/**
 * Get wallet summary for logging
 */
export function getWalletSummary(wallet: TestWalletConfig): string {
  const balances = Object.entries(wallet.balances)
    .map(([token, amount]) => formatBalance(amount || 0, token))
    .join(', ');

  const nftCount = wallet.nfts?.length || 0;
  const nftInfo = nftCount > 0 ? `, ${nftCount} NFTs` : '';

  const balanceText = balances || 'No balances';

  return `${wallet.name}: ${balanceText}${nftInfo}`;
}
