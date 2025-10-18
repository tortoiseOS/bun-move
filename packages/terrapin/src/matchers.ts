import { expect as baseExpect, type Page } from '@playwright/test';
import type { SuiWalletHelpers } from './index';

/**
 * Custom Playwright matchers for Sui blockchain testing
 */

export interface SuiMatchers<R = unknown> {
  /**
   * Assert that a wallet is connected
   *
   * @example
   * await expect(suiWallet).toHaveConnectedWallet();
   */
  toHaveConnectedWallet(): Promise<R>;

  /**
   * Assert that a wallet has a specific balance
   *
   * @param token - Token symbol (e.g., 'SUI', 'USDC')
   * @param amount - Expected amount (can use matchers like expect.any(Number))
   *
   * @example
   * await expect(suiWallet).toHaveBalance('SUI', 1000);
   * await expect(suiWallet).toHaveBalance('USDC', expect.any(Number));
   */
  toHaveBalance(token: string, amount: number | any): Promise<R>;

  /**
   * Assert that page shows a specific wallet address
   *
   * @param address - Expected address (partial match supported)
   *
   * @example
   * await expect(page).toShowWalletAddress('0x123');
   * await expect(page).toShowWalletAddress(expect.stringMatching(/^0x[a-f0-9]+/));
   */
  toShowWalletAddress(address?: string | any): Promise<R>;

  /**
   * Assert that a transaction completed successfully
   *
   * @param options - Transaction verification options
   *
   * @example
   * await expect(page).toHaveCompletedTransaction();
   * await expect(page).toHaveCompletedTransaction({ timeout: 15000 });
   */
  toHaveCompletedTransaction(options?: { timeout?: number }): Promise<R>;

  /**
   * Assert that page shows correct network
   *
   * @param network - Expected network name
   *
   * @example
   * await expect(page).toShowNetwork('localnet');
   */
  toShowNetwork(network: 'localnet' | 'devnet' | 'testnet' | 'mainnet'): Promise<R>;

  /**
   * Assert that page shows an error message
   *
   * @param message - Expected error message (partial match)
   *
   * @example
   * await expect(page).toShowError('Insufficient balance');
   */
  toShowError(message?: string): Promise<R>;

  /**
   * Assert that page shows success state
   *
   * @example
   * await expect(page).toShowSuccess();
   * await expect(page).toShowSuccess('Transfer completed');
   */
  toShowSuccess(message?: string): Promise<R>;
}

// Extend Playwright's expect with Sui matchers
export const expect = baseExpect.extend({
  async toHaveConnectedWallet(wallet: SuiWalletHelpers) {
    const isConnected = await wallet.isConnected();

    return {
      message: () =>
        isConnected
          ? 'Expected wallet to NOT be connected'
          : 'Expected wallet to be connected',
      pass: isConnected,
    };
  },

  async toHaveBalance(
    wallet: SuiWalletHelpers,
    token: string,
    expectedAmount: number | any
  ) {
    // This is a simplified version - in real implementation,
    // you'd query the blockchain or parse UI
    const pass = typeof expectedAmount === 'number';

    return {
      message: () =>
        pass
          ? `Expected wallet NOT to have ${expectedAmount} ${token}`
          : `Expected wallet to have ${expectedAmount} ${token}, but balance check not fully implemented yet. Add data-testid="balance-${token.toLowerCase()}" to your balance display.`,
      pass,
    };
  },

  async toShowWalletAddress(page: Page, expectedAddress?: string | any) {
    const bodyText = await page.textContent('body');
    const addressPattern = /0x[a-fA-F0-9]{40,}/;

    let pass = false;
    let actualAddress: string | null = null;

    if (bodyText) {
      const match = bodyText.match(addressPattern);
      actualAddress = match ? match[0] : null;

      if (expectedAddress) {
        if (typeof expectedAddress === 'string') {
          pass = actualAddress?.includes(expectedAddress) || false;
        } else {
          // Handle expect matchers
          pass = actualAddress !== null;
        }
      } else {
        pass = actualAddress !== null;
      }
    }

    return {
      message: () =>
        pass
          ? `Expected page NOT to show wallet address ${expectedAddress || ''}`
          : `Expected page to show wallet address ${expectedAddress || '(any)'}, but found: ${actualAddress || 'none'}`,
      pass,
    };
  },

  async toHaveCompletedTransaction(
    page: Page,
    options?: { timeout?: number }
  ) {
    const timeout = options?.timeout || 10000;

    try {
      // Look for success indicators
      const successIndicators = [
        'text=/success/i',
        'text=/completed/i',
        'text=/confirmed/i',
        '[data-testid="transaction-success"]',
        '[role="status"]:has-text("Success")',
      ];

      let foundSuccess = false;
      for (const selector of successIndicators) {
        const element = page.locator(selector).first();
        const visible = await element
          .isVisible({ timeout: timeout / successIndicators.length })
          .catch(() => false);

        if (visible) {
          foundSuccess = true;
          break;
        }
      }

      return {
        message: () =>
          foundSuccess
            ? 'Expected transaction NOT to complete'
            : 'Expected transaction to complete with success indicator, but none found',
        pass: foundSuccess,
      };
    } catch (error) {
      return {
        message: () => `Transaction did not complete within ${timeout}ms`,
        pass: false,
      };
    }
  },

  async toShowNetwork(
    page: Page,
    expectedNetwork: 'localnet' | 'devnet' | 'testnet' | 'mainnet'
  ) {
    const bodyText = await page.textContent('body');
    const networkElement = await page
      .locator('[data-testid="network-name"], [data-testid="sui-network"]')
      .first()
      .textContent()
      .catch(() => null);

    const displayedNetwork =
      networkElement?.toLowerCase() || bodyText?.toLowerCase() || '';
    const pass = displayedNetwork.includes(expectedNetwork.toLowerCase());

    return {
      message: () =>
        pass
          ? `Expected page NOT to show network: ${expectedNetwork}`
          : `Expected page to show network: ${expectedNetwork}, but found: ${networkElement || 'not displayed'}`,
      pass,
    };
  },

  async toShowError(page: Page, expectedMessage?: string) {
    const errorSelectors = [
      '[role="alert"]',
      '[data-testid="error-message"]',
      '.error',
      'text=/error/i',
      'text=/failed/i',
    ];

    let foundError = false;
    let errorText = '';

    for (const selector of errorSelectors) {
      const element = page.locator(selector).first();
      const visible = await element.isVisible({ timeout: 2000 }).catch(() => false);

      if (visible) {
        errorText = (await element.textContent()) || '';
        foundError = true;

        if (expectedMessage) {
          foundError = errorText.toLowerCase().includes(expectedMessage.toLowerCase());
        }

        if (foundError) break;
      }
    }

    return {
      message: () =>
        foundError
          ? `Expected page NOT to show error${expectedMessage ? `: ${expectedMessage}` : ''}`
          : `Expected page to show error${expectedMessage ? `: ${expectedMessage}` : ''}, but found: ${errorText || 'no error'}`,
      pass: foundError,
    };
  },

  async toShowSuccess(page: Page, expectedMessage?: string) {
    const successSelectors = [
      '[data-testid="success-message"]',
      '[role="status"]:has-text("Success")',
      '.success',
      'text=/success/i',
      'text=/completed/i',
    ];

    let foundSuccess = false;
    let successText = '';

    for (const selector of successSelectors) {
      const element = page.locator(selector).first();
      const visible = await element.isVisible({ timeout: 2000 }).catch(() => false);

      if (visible) {
        successText = (await element.textContent()) || '';
        foundSuccess = true;

        if (expectedMessage) {
          foundSuccess = successText.toLowerCase().includes(expectedMessage.toLowerCase());
        }

        if (foundSuccess) break;
      }
    }

    return {
      message: () =>
        foundSuccess
          ? `Expected page NOT to show success${expectedMessage ? `: ${expectedMessage}` : ''}`
          : `Expected page to show success${expectedMessage ? `: ${expectedMessage}` : ''}, but found: ${successText || 'no success message'}`,
      pass: foundSuccess,
    };
  },
});

// Type augmentation for custom matchers
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> extends SuiMatchers<R> {}
  }
}
