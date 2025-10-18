import { test as base, expect, Page } from '@playwright/test';

/**
 * Custom Playwright fixtures for Sui wallet testing
 * These fixtures help interact with the Sui burner wallet in E2E tests
 */

export interface SuiWalletFixtures {
  suiWallet: SuiWalletHelpers;
}

export interface SuiWalletHelpers {
  /**
   * Connect to the unsafe burner wallet
   * @param page - Playwright page instance
   */
  connect: () => Promise<void>;

  /**
   * Disconnect from the current wallet
   * @param page - Playwright page instance
   */
  disconnect: () => Promise<void>;

  /**
   * Get the current connected wallet address
   * @returns Promise<string | null> - The wallet address or null if not connected
   */
  getAddress: () => Promise<string | null>;

  /**
   * Wait for a transaction to complete
   * @param timeout - Max time to wait in milliseconds
   */
  waitForTransaction: (timeout?: number) => Promise<void>;

  /**
   * Check if wallet is connected
   * @returns Promise<boolean>
   */
  isConnected: () => Promise<boolean>;
}

export const test = base.extend<SuiWalletFixtures>({
  suiWallet: async ({ page }, use) => {
    const helpers: SuiWalletHelpers = {
      connect: async () => {
        // Look for the connect wallet button
        const connectButton = page.getByRole('button', { name: /connect wallet/i });

        // If already connected, skip
        const isConnected = await helpers.isConnected();
        if (isConnected) {
          return;
        }

        // Click connect button
        await connectButton.click();

        // Wait for wallet selection menu to appear
        await page.waitForSelector('[role="menu"], [role="dialog"]', { timeout: 5000 });

        // Select the burner wallet (usually first option or has "burner" in name)
        const burnerWalletOption = page.locator('button, [role="menuitem"]').filter({
          hasText: /burner|unsafe/i,
        }).first();

        if (await burnerWalletOption.isVisible()) {
          await burnerWalletOption.click();
        } else {
          // If no specific burner option, click first wallet option
          await page.locator('button, [role="menuitem"]').first().click();
        }

        // Wait for connection to complete
        await page.waitForTimeout(1000);

        // Verify connection succeeded
        const connected = await helpers.isConnected();
        expect(connected).toBe(true);
      },

      disconnect: async () => {
        // Look for disconnect button or wallet menu
        const disconnectButton = page.getByRole('button', { name: /disconnect|wallet/i });

        if (await disconnectButton.isVisible()) {
          await disconnectButton.click();

          // If a menu appears, click disconnect option
          const disconnectOption = page.locator('button, [role="menuitem"]').filter({
            hasText: /disconnect/i,
          });

          if (await disconnectOption.isVisible()) {
            await disconnectOption.click();
          }

          // Wait for disconnection
          await page.waitForTimeout(500);
        }
      },

      getAddress: async () => {
        try {
          // Try to find wallet address in the UI
          // This assumes the wallet address is displayed somewhere
          const addressElement = await page.locator('[data-testid="wallet-address"]').first();

          if (await addressElement.isVisible()) {
            return await addressElement.textContent();
          }

          return null;
        } catch {
          return null;
        }
      },

      waitForTransaction: async (timeout = 10000) => {
        // Wait for transaction loading indicator to appear and disappear
        const loadingIndicator = page.locator('[role="status"], .loading, [aria-busy="true"]');

        try {
          // Wait for loading to appear (transaction started)
          await loadingIndicator.waitFor({ state: 'visible', timeout: 2000 });
        } catch {
          // Loading might be too fast to catch
        }

        // Wait for loading to disappear (transaction complete)
        await loadingIndicator.waitFor({ state: 'hidden', timeout });
      },

      isConnected: async () => {
        // Check if we can find a disconnect button or wallet address
        const disconnectButton = page.getByRole('button', { name: /disconnect/i });
        const isVisible = await disconnectButton.isVisible().catch(() => false);

        return isVisible;
      },
    };

    await use(helpers);
  },
});

export { expect } from '@playwright/test';
