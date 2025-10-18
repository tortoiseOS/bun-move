/**
 * Integration test to verify new sui-playwright v0.2.0 features
 * Tests: Custom Matchers, Test Wallets, and Package Exports
 */

import { test, expect, expectWithMatchers, getTestWallet, TEST_WALLETS, suiToMist, mistToSui, formatBalance } from '@tortoiseos/terrapin';

test.describe('sui-playwright v0.2.0 Features', () => {
  test('should import and use test wallets', async () => {
    // Test TEST_WALLETS export
    expect(TEST_WALLETS).toBeDefined();
    expect(Object.keys(TEST_WALLETS)).toHaveLength(9);

    // Test getTestWallet function
    const whale = getTestWallet('whale');
    expect(whale.name).toBe('Whale');
    expect(whale.balances.SUI).toBe(1_000_000_000_000_000);

    const normie = getTestWallet('normie');
    expect(normie.name).toBe('Normie');
    expect(normie.balances.SUI).toBe(100_000_000_000);

    const poor = getTestWallet('poor');
    expect(poor.balances.SUI).toBe(500_000_000); // 0.5 SUI
  });

  test('should use helper functions', async () => {
    // Test suiToMist
    expect(suiToMist(1)).toBe(1_000_000_000);
    expect(suiToMist(100)).toBe(100_000_000_000);
    expect(suiToMist(0.5)).toBe(500_000_000);

    // Test mistToSui
    expect(mistToSui(1_000_000_000)).toBe(1);
    expect(mistToSui(100_000_000_000)).toBe(100);
    expect(mistToSui(500_000_000)).toBe(0.5);

    // Test formatBalance
    expect(formatBalance(1_000_000_000)).toBe('1 SUI');
    expect(formatBalance(1_000_000_000_000_000)).toBe('1,000,000 SUI');
    expect(formatBalance(100_000_000, 'USDC', 6)).toBe('100 USDC');
  });

  test('should have custom matchers available', async ({ page, suiWallet }) => {
    // Verify expectWithMatchers is exported
    expect(expectWithMatchers).toBeDefined();
    expect(typeof expectWithMatchers).toBe('function');

    // Note: We can't fully test matchers without a running app,
    // but we can verify they're exported and have the right shape
    console.log('✅ Custom matchers are available for use');
  });

  test('should work with existing wallet connection', async ({ page, suiWallet }) => {
    // Test that existing functionality still works
    await page.goto('/');

    // Initial state
    expect(await suiWallet.isConnected()).toBe(false);

    // Connect wallet
    await suiWallet.connect();
    expect(await suiWallet.isConnected()).toBe(true);

    // Get address
    const address = await suiWallet.getAddress();
    expect(address).not.toBeNull();

    console.log('✅ Wallet connected successfully');
    console.log('📍 Address:', address);

    // Disconnect
    await suiWallet.disconnect();
    expect(await suiWallet.isConnected()).toBe(false);
  });

  test('should verify all exports are working', async () => {
    // Verify all new exports from v0.2.0
    const exports = {
      expectWithMatchers,
      TEST_WALLETS,
      getTestWallet,
      suiToMist,
      mistToSui,
      formatBalance,
    };

    for (const [name, exportedItem] of Object.entries(exports)) {
      expect(exportedItem).toBeDefined();
      console.log(`✅ Export verified: ${name}`);
    }

    console.log('\n✅ All v0.2.0 features verified successfully!');
  });
});
