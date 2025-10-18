/**
 * Transaction Builder for Sui blockchain testing
 *
 * Provides a fluent API for building and executing transactions in tests
 */

import type { Page } from '@playwright/test';

export interface TransactionStep {
  type: 'transfer' | 'split' | 'merge' | 'moveCall' | 'custom';
  params: Record<string, any>;
}

export interface TransactionBuilderOptions {
  timeout?: number;
  gasbudget?: number;
}

/**
 * Transaction Builder - Fluent API for constructing Sui transactions
 *
 * @example
 * ```typescript
 * const txBuilder = createTransactionBuilder(page, suiWallet);
 *
 * await txBuilder
 *   .transfer('0x123...', 100_000_000)
 *   .split(coinId, [50_000_000, 50_000_000])
 *   .execute();
 * ```
 */
export class SuiTransactionBuilder {
  private steps: TransactionStep[] = [];
  private options: TransactionBuilderOptions;

  constructor(
    private page: Page,
    private walletHelpers: any,
    options: TransactionBuilderOptions = {}
  ) {
    this.options = {
      timeout: options.timeout || 10000,
      gasbudget: options.gasbudget || 10_000_000,
    };
  }

  /**
   * Transfer SUI to a recipient
   *
   * @param recipient - Recipient address
   * @param amount - Amount in MIST
   *
   * @example
   * ```typescript
   * await txBuilder.transfer('0x123...', 100_000_000).execute();
   * ```
   */
  transfer(recipient: string, amount: number): this {
    this.steps.push({
      type: 'transfer',
      params: { recipient, amount },
    });
    return this;
  }

  /**
   * Split a coin into multiple coins
   *
   * @param coinId - Coin object ID
   * @param amounts - Array of amounts for each new coin
   *
   * @example
   * ```typescript
   * await txBuilder.split('0xabc...', [50, 50]).execute();
   * ```
   */
  split(coinId: string, amounts: number[]): this {
    this.steps.push({
      type: 'split',
      params: { coinId, amounts },
    });
    return this;
  }

  /**
   * Merge multiple coins into one
   *
   * @param targetCoinId - Target coin to merge into
   * @param sourceCoinIds - Coins to merge
   *
   * @example
   * ```typescript
   * await txBuilder.merge('0x123...', ['0xabc...', '0xdef...']).execute();
   * ```
   */
  merge(targetCoinId: string, sourceCoinIds: string[]): this {
    this.steps.push({
      type: 'merge',
      params: { targetCoinId, sourceCoinIds },
    });
    return this;
  }

  /**
   * Call a Move function
   *
   * @param target - Package::Module::Function
   * @param typeArgs - Type arguments
   * @param args - Function arguments
   *
   * @example
   * ```typescript
   * await txBuilder.moveCall(
   *   '0x2::coin::transfer',
   *   ['0x2::sui::SUI'],
   *   [coin, recipient]
   * ).execute();
   * ```
   */
  moveCall(target: string, typeArgs: string[] = [], args: any[] = []): this {
    this.steps.push({
      type: 'moveCall',
      params: { target, typeArgs, args },
    });
    return this;
  }

  /**
   * Add a custom transaction step
   *
   * @param stepFn - Custom step function
   *
   * @example
   * ```typescript
   * await txBuilder.custom(async (tx) => {
   *   // Custom transaction logic
   *   return tx;
   * }).execute();
   * ```
   */
  custom(stepFn: (tx: any) => any): this {
    this.steps.push({
      type: 'custom',
      params: { stepFn },
    });
    return this;
  }

  /**
   * Get transaction digest after execution
   */
  private lastDigest: string | null = null;

  getDigest(): string | null {
    return this.lastDigest;
  }

  /**
   * Execute the transaction
   *
   * @returns Transaction digest
   *
   * @example
   * ```typescript
   * const digest = await txBuilder.transfer('0x123', 100).execute();
   * console.log('Transaction:', digest);
   * ```
   */
  async execute(): Promise<string> {
    console.log('[terrapin:tx-builder] Executing transaction with', this.steps.length, 'steps');

    // For testing purposes, we simulate transaction execution
    // In a real implementation, this would build and submit a PTB (Programmable Transaction Block)

    // Log the transaction steps
    this.steps.forEach((step, index) => {
      console.log(`[terrapin:tx-builder] Step ${index + 1}:`, step.type, step.params);
    });

    // Wait for the transaction to complete
    await this.walletHelpers.waitForTransaction(this.options.timeout);

    // Generate a mock digest
    this.lastDigest = `0x${Math.random().toString(16).slice(2)}`;

    console.log('[terrapin:tx-builder] Transaction completed:', this.lastDigest);

    return this.lastDigest;
  }

  /**
   * Execute and wait for confirmation
   *
   * @param confirmations - Number of confirmations to wait for
   * @returns Transaction digest
   */
  async executeAndWait(confirmations: number = 1): Promise<string> {
    const digest = await this.execute();

    console.log(`[terrapin:tx-builder] Waiting for ${confirmations} confirmations...`);

    // Simulate waiting for confirmations
    await this.page.waitForTimeout(confirmations * 1000);

    return digest;
  }

  /**
   * Reset the builder to start a new transaction
   */
  reset(): this {
    this.steps = [];
    this.lastDigest = null;
    return this;
  }

  /**
   * Get the current transaction steps
   */
  getSteps(): TransactionStep[] {
    return [...this.steps];
  }
}

/**
 * Create a transaction builder instance
 *
 * @param page - Playwright page
 * @param walletHelpers - Sui wallet helpers
 * @param options - Builder options
 *
 * @example
 * ```typescript
 * const txBuilder = createTransactionBuilder(page, suiWallet);
 * await txBuilder.transfer('0x123', 100).execute();
 * ```
 */
export function createTransactionBuilder(
  page: Page,
  walletHelpers: any,
  options?: TransactionBuilderOptions
): SuiTransactionBuilder {
  return new SuiTransactionBuilder(page, walletHelpers, options);
}
