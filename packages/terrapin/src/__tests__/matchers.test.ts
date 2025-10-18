/**
 * Unit tests for custom Sui matchers
 */

import { expect as expectWithMatchers } from '../matchers';
import type { SuiWalletHelpers } from '../index';

describe('Custom Sui Matchers', () => {
  // Mock wallet helpers for testing
  const mockConnectedWallet: SuiWalletHelpers = {
    connect: async () => {},
    disconnect: async () => {},
    isConnected: async () => true,
    getAddress: async () => '0x1234567890abcdef',
    waitForTransaction: async () => {},
    getNetwork: async () => 'localnet',
  };

  const mockDisconnectedWallet: SuiWalletHelpers = {
    connect: async () => {},
    disconnect: async () => {},
    isConnected: async () => false,
    getAddress: async () => null,
    waitForTransaction: async () => {},
    getNetwork: async () => null,
  };

  describe('toHaveConnectedWallet', () => {
    it('should pass when wallet is connected', async () => {
      await expectWithMatchers(mockConnectedWallet).toHaveConnectedWallet();
      // If no error is thrown, the test passes
      expect(true).toBe(true);
    });

    it('should fail when wallet is not connected', async () => {
      let errorThrown = false;
      try {
        await expectWithMatchers(mockDisconnectedWallet).toHaveConnectedWallet();
      } catch (error) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('Type exports', () => {
    it('should export SuiMatchers type', () => {
      // This is a compile-time check - if this compiles, the type exists
      type TestType = import('../matchers').SuiMatchers;
      expect(true).toBe(true);
    });
  });
});
