/**
 * Unit tests for test wallet presets
 */

import {
  TEST_WALLETS,
  getTestWallet,
  createTestWallet,
  listTestWallets,
  getWalletSummary,
  suiToMist,
  mistToSui,
  formatBalance,
} from '../test-wallets';

describe('Test Wallet Presets', () => {
  describe('TEST_WALLETS', () => {
    it('should export all 9 wallet presets', () => {
      const wallets = Object.keys(TEST_WALLETS);
      expect(wallets).toHaveLength(9);
      expect(wallets).toContain('whale');
      expect(wallets).toContain('normie');
      expect(wallets).toContain('degen');
      expect(wallets).toContain('poor');
      expect(wallets).toContain('empty');
      expect(wallets).toContain('nftCollector');
      expect(wallets).toContain('gasSponsor');
      expect(wallets).toContain('staker');
      expect(wallets).toContain('multiToken');
    });

    it('should have valid whale wallet config', () => {
      const whale = TEST_WALLETS.whale;
      expect(whale.name).toBe('Whale');
      expect(whale.balances.SUI).toBe(1_000_000_000_000_000); // 1M SUI
      expect(whale.isGasSponsor).toBe(true);
    });

    it('should have valid empty wallet config', () => {
      const empty = TEST_WALLETS.empty;
      expect(empty.name).toBe('Empty');
      expect(Object.keys(empty.balances)).toHaveLength(0);
    });
  });

  describe('getTestWallet', () => {
    it('should return whale wallet', () => {
      const whale = getTestWallet('whale');
      expect(whale.name).toBe('Whale');
      expect(whale.balances.SUI).toBe(1_000_000_000_000_000);
    });

    it('should return normie wallet', () => {
      const normie = getTestWallet('normie');
      expect(normie.name).toBe('Normie');
      expect(normie.balances.SUI).toBe(100_000_000_000); // 100 SUI
    });

    it('should throw error for invalid wallet name', () => {
      expect(() => getTestWallet('invalid' as any)).toThrow('Test wallet "invalid" not found');
    });
  });

  describe('createTestWallet', () => {
    it('should create custom wallet', () => {
      const custom = createTestWallet({
        name: 'Custom',
        description: 'Custom test wallet',
        balances: { SUI: 50_000_000_000 },
      });

      expect(custom.name).toBe('Custom');
      expect(custom.description).toBe('Custom test wallet');
      expect(custom.balances.SUI).toBe(50_000_000_000);
    });
  });

  describe('listTestWallets', () => {
    it('should return all wallet names', () => {
      const names = listTestWallets();
      expect(names).toHaveLength(9);
      expect(names).toContain('whale');
      expect(names).toContain('empty');
    });
  });

  describe('getWalletSummary', () => {
    it('should return formatted summary for whale', () => {
      const whale = getTestWallet('whale');
      const summary = getWalletSummary(whale);

      expect(summary).toContain('Whale');
      expect(summary).toContain('SUI');
      expect(summary).toContain('2 NFTs');
    });

    it('should return formatted summary for empty wallet', () => {
      const empty = getTestWallet('empty');
      const summary = getWalletSummary(empty);

      expect(summary).toContain('Empty');
      expect(summary).toContain('No balances');
    });
  });

  describe('suiToMist', () => {
    it('should convert 1 SUI to MIST', () => {
      expect(suiToMist(1)).toBe(1_000_000_000);
    });

    it('should convert 10 SUI to MIST', () => {
      expect(suiToMist(10)).toBe(10_000_000_000);
    });

    it('should handle decimal values', () => {
      expect(suiToMist(0.5)).toBe(500_000_000);
    });

    it('should handle zero', () => {
      expect(suiToMist(0)).toBe(0);
    });
  });

  describe('mistToSui', () => {
    it('should convert 1B MIST to 1 SUI', () => {
      expect(mistToSui(1_000_000_000)).toBe(1);
    });

    it('should convert 10B MIST to 10 SUI', () => {
      expect(mistToSui(10_000_000_000)).toBe(10);
    });

    it('should handle zero', () => {
      expect(mistToSui(0)).toBe(0);
    });
  });

  describe('formatBalance', () => {
    it('should format 1B MIST as "1 SUI"', () => {
      expect(formatBalance(1_000_000_000)).toBe('1 SUI');
    });

    it('should format large amounts with commas', () => {
      expect(formatBalance(1_000_000_000_000_000)).toBe('1,000,000 SUI');
    });

    it('should handle decimal places', () => {
      expect(formatBalance(1_500_000_000)).toBe('1.5 SUI');
    });

    it('should handle custom token with 6 decimals', () => {
      // USDC typically has 6 decimals
      expect(formatBalance(100_000_000, 'USDC', 6)).toBe('100 USDC');
    });
  });

  describe('Wallet balance consistency', () => {
    it('whale should have appropriate balances', () => {
      const whale = getTestWallet('whale');
      expect(mistToSui(whale.balances.SUI)).toBe(1_000_000);
    });

    it('normie should have 100 SUI', () => {
      const normie = getTestWallet('normie');
      expect(mistToSui(normie.balances.SUI)).toBe(100);
    });

    it('poor should have 0.5 SUI', () => {
      const poor = getTestWallet('poor');
      expect(mistToSui(poor.balances.SUI)).toBe(0.5);
    });
  });
});
