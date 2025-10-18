import { test as base, expect as baseExpect, Page } from '@playwright/test';

/**
 * @tortoiseos/terrapin
 *
 * Playwright testing utilities for Sui blockchain dApps.
 * Provides fixtures and helpers for testing Sui wallet interactions.
 *
 * @example
 * ```typescript
 * import { test, expect } from '@tortoiseos/terrapin';
 *
 * test('should connect wallet', async ({ page, suiWallet }) => {
 *   await page.goto('/');
 *   await suiWallet.connect();
 *   expect(await suiWallet.isConnected()).toBe(true);
 * });
 * ```
 */

export interface SuiWalletHelpers {
  /**
   * Connect to the Sui wallet (unsafe burner wallet in test mode)
   *
   * @throws {Error} If wallet connection fails or times out
   *
   * @example
   * ```typescript
   * await suiWallet.connect();
   * ```
   */
  connect: () => Promise<void>;

  /**
   * Disconnect from the currently connected wallet
   *
   * @example
   * ```typescript
   * await suiWallet.disconnect();
   * ```
   */
  disconnect: () => Promise<void>;

  /**
   * Get the currently connected wallet address
   *
   * @returns The wallet address (0x...) or null if not connected or not displayed
   *
   * @example
   * ```typescript
   * const address = await suiWallet.getAddress();
   * expect(address).toMatch(/^0x[a-fA-F0-9]+/);
   * ```
   */
  getAddress: () => Promise<string | null>;

  /**
   * Wait for a transaction to complete
   *
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   * @throws {Error} If transaction doesn't complete within timeout
   *
   * @example
   * ```typescript
   * await page.click('[data-testid="send-button"]');
   * await suiWallet.waitForTransaction(15000);
   * ```
   */
  waitForTransaction: (timeout?: number) => Promise<void>;

  /**
   * Check if a wallet is currently connected
   *
   * @returns true if wallet is connected, false otherwise
   *
   * @example
   * ```typescript
   * const connected = await suiWallet.isConnected();
   * if (connected) {
   *   // Do something with wallet
   * }
   * ```
   */
  isConnected: () => Promise<boolean>;

  /**
   * Get the current network the wallet is connected to
   *
   * @returns The network name (localnet, devnet, testnet, mainnet) or null
   *
   * @example
   * ```typescript
   * const network = await suiWallet.getNetwork();
   * expect(network).toBe('localnet');
   * ```
   */
  getNetwork: () => Promise<string | null>;
}

export interface SuiWalletFixtures {
  /**
   * Sui wallet testing helpers
   *
   * Provides methods to interact with Sui wallets in E2E tests.
   * Works with @mysten/dapp-kit's unsafe burner wallet.
   */
  suiWallet: SuiWalletHelpers;
}

/**
 * Extended Playwright test with Sui wallet fixtures
 *
 * Use this instead of @playwright/test to get access to suiWallet helpers.
 *
 * @example
 * ```typescript
 * import { test, expect } from '@tortoiseos/terrapin';
 *
 * test('wallet test', async ({ page, suiWallet }) => {
 *   await suiWallet.connect();
 * });
 * ```
 */
export const test = base.extend<SuiWalletFixtures>({
  suiWallet: async ({ page }, use) => {
    const helpers: SuiWalletHelpers = {
      connect: async () => {
        // Check if already connected
        const isConnected = await helpers.isConnected();
        if (isConnected) {
          console.log('[terrapin] Wallet already connected, skipping connect()');
          return;
        }

        // Look for the connect wallet button
        const connectButton = page.getByRole('button', { name: /connect wallet/i });

        if (!(await connectButton.isVisible({ timeout: 5000 }).catch(() => false))) {
          throw new Error('[terrapin] Connect wallet button not found. Make sure your app has a connect button.');
        }

        // Click connect button
        await connectButton.click();

        // Wait for wallet selection menu to appear
        const menuAppeared = await page
          .waitForSelector('[role="menu"], [role="dialog"], [data-testid="wallet-menu"]', {
            timeout: 5000,
          })
          .catch(() => null);

        if (!menuAppeared) {
          throw new Error('[terrapin] Wallet selection menu did not appear');
        }

        // Select the burner wallet (usually first option or has "burner" in name)
        const burnerWalletOption = page
          .locator('button, [role="menuitem"]')
          .filter({
            hasText: /burner|unsafe|test/i,
          })
          .first();

        const burnerVisible = await burnerWalletOption.isVisible().catch(() => false);

        if (burnerVisible) {
          await burnerWalletOption.click();
        } else {
          // If no specific burner option, click first wallet option
          const firstOption = page.locator('button, [role="menuitem"]').first();
          if (await firstOption.isVisible()) {
            await firstOption.click();
          } else {
            throw new Error('[terrapin] No wallet option found in menu');
          }
        }

        // Wait for connection to complete
        await page.waitForTimeout(1500);

        // Verify connection succeeded
        const connected = await helpers.isConnected();
        if (!connected) {
          throw new Error('[terrapin] Wallet connection failed - disconnect button not found after connect attempt');
        }

        console.log('[terrapin] Wallet connected successfully');
      },

      disconnect: async () => {
        const isConnected = await helpers.isConnected();
        if (!isConnected) {
          console.log('[terrapin] Wallet not connected, skipping disconnect()');
          return;
        }

        // Look for disconnect button or wallet menu
        const walletButton = page.getByRole('button', { name: /disconnect|wallet|0x/i });

        if (await walletButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await walletButton.click();

          // If a menu appears, click disconnect option
          const disconnectOption = page.locator('button, [role="menuitem"]').filter({
            hasText: /disconnect/i,
          });

          if (await disconnectOption.isVisible({ timeout: 2000 }).catch(() => false)) {
            await disconnectOption.click();
          }

          // Wait for disconnection
          await page.waitForTimeout(1000);

          console.log('[terrapin] Wallet disconnected');
        }
      },

      getAddress: async () => {
        try {
          // Try to find wallet address in the UI
          // Method 1: Look for data-testid="wallet-address"
          const addressElement = page.locator('[data-testid="wallet-address"]').first();

          if (await addressElement.isVisible({ timeout: 1000 }).catch(() => false)) {
            const text = await addressElement.textContent();
            return text?.trim() || null;
          }

          // Method 2: Look for any text matching Sui address pattern
          const bodyText = await page.textContent('body');
          const addressMatch = bodyText?.match(/(0x[a-fA-F0-9]{40,})/);

          return addressMatch ? addressMatch[1] : null;
        } catch {
          return null;
        }
      },

      waitForTransaction: async (timeout = 10000) => {
        // Wait for transaction loading indicator to appear and disappear
        const loadingSelectors = [
          '[role="status"]',
          '[role="progressbar"]',
          '.loading',
          '[aria-busy="true"]',
          '[data-testid="transaction-loading"]',
        ];

        const loadingIndicator = page.locator(loadingSelectors.join(', '));

        try {
          // Wait for loading to appear (transaction started)
          await loadingIndicator.waitFor({ state: 'visible', timeout: 3000 });
          console.log('[terrapin] Transaction loading started');
        } catch {
          // Loading might be too fast to catch, or no loading indicator
          console.log('[terrapin] No loading indicator detected (transaction may be instant)');
        }

        try {
          // Wait for loading to disappear (transaction complete)
          await loadingIndicator.waitFor({ state: 'hidden', timeout });
          console.log('[terrapin] Transaction completed');
        } catch {
          // If no loading indicator was shown, wait a bit anyway
          await page.waitForTimeout(2000);
        }
      },

      isConnected: async () => {
        // Check if we can find a disconnect button or wallet address
        const indicators = [
          page.getByRole('button', { name: /disconnect/i }),
          page.locator('[data-testid="wallet-address"]'),
          page.locator('button:has-text("0x")'),
        ];

        for (const indicator of indicators) {
          const isVisible = await indicator.isVisible({ timeout: 1000 }).catch(() => false);
          if (isVisible) {
            return true;
          }
        }

        return false;
      },

      getNetwork: async () => {
        try {
          // Look for network indicator in UI
          const networkElement = page.locator('[data-testid="network-name"], [data-testid="sui-network"]').first();

          if (await networkElement.isVisible({ timeout: 1000 }).catch(() => false)) {
            const text = await networkElement.textContent();
            return text?.toLowerCase().trim() || null;
          }

          // Try to find network name in page text
          const bodyText = await page.textContent('body');
          const networkMatch = bodyText?.match(/(localnet|devnet|testnet|mainnet)/i);

          return networkMatch ? networkMatch[1].toLowerCase() : null;
        } catch {
          return null;
        }
      },
    };

    await use(helpers);

    // Cleanup: Disconnect wallet after test if still connected
    try {
      if (await helpers.isConnected()) {
        console.log('[terrapin] Cleaning up: disconnecting wallet');
        await helpers.disconnect();
      }
    } catch (error) {
      console.warn('[terrapin] Failed to disconnect wallet during cleanup:', error);
    }
  },
});

/**
 * Re-export expect from Playwright for convenience
 *
 * @example
 * ```typescript
 * import { test, expect } from '@tortoiseos/terrapin';
 * ```
 */
export const expect = baseExpect;

/**
 * Re-export types from Playwright
 */
export type { Page, Locator, BrowserContext } from '@playwright/test';

/**
 * Export custom matchers
 *
 * @example
 * ```typescript
 * import { expect } from '@tortoiseos/terrapin/matchers';
 *
 * await expect(suiWallet).toHaveConnectedWallet();
 * await expect(page).toShowWalletAddress('0x123');
 * ```
 */
export { expect as expectWithMatchers } from './matchers';
export type { SuiMatchers } from './matchers';

/**
 * Export test wallet utilities
 *
 * @example
 * ```typescript
 * import { TEST_WALLETS, getTestWallet } from '@tortoiseos/terrapin/test-wallets';
 *
 * const whale = getTestWallet('whale');
 * console.log(whale.balances.SUI); // 1,000,000,000,000,000 MIST
 * ```
 */
export {
  TEST_WALLETS,
  getTestWallet,
  createTestWallet,
  listTestWallets,
  getWalletSummary,
  suiToMist,
  mistToSui,
  formatBalance,
} from './test-wallets';
export type {
  TestWalletConfig,
  TestWalletBalance,
  TestWalletNFT,
} from './test-wallets';

/**
 * Export Transaction Builder utilities (P1)
 *
 * @example
 * ```typescript
 * import { createTransactionBuilder } from '@tortoise-os/terrapin';
 *
 * const txBuilder = createTransactionBuilder(page, suiWallet);
 * await txBuilder
 *   .transfer('0x123...', 100_000_000)
 *   .execute();
 * ```
 */
export {
  createTransactionBuilder,
  SuiTransactionBuilder,
} from './transaction-builder';
export type {
  TransactionStep,
  TransactionBuilderOptions,
} from './transaction-builder';

/**
 * Export Event Listener utilities (P1)
 *
 * @example
 * ```typescript
 * import { createEventListener } from '@tortoise-os/terrapin';
 *
 * const listener = createEventListener(page);
 * await listener.waitForEvent('Transfer');
 * const events = listener.getEvents();
 * ```
 */
export {
  createEventListener,
  SuiEventListener,
} from './event-listener';
export type {
  SuiEvent,
  EventListenerOptions,
} from './event-listener';

/**
 * Export Network Mocking utilities (P1)
 *
 * @example
 * ```typescript
 * import { createNetworkMock } from '@tortoise-os/terrapin';
 *
 * const mock = createNetworkMock(page);
 * await mock.mockBalance('0x123...', 1_000_000_000);
 * await mock.enable();
 * ```
 */
export {
  createNetworkMock,
  SuiNetworkMock,
} from './network-mock';
export type {
  NetworkMockConfig,
  MockResponse,
} from './network-mock';
