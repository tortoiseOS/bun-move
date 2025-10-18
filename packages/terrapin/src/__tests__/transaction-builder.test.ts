/**
 * Unit tests for Transaction Builder
 */

import { createTransactionBuilder, SuiTransactionBuilder } from '../transaction-builder';
import type { Page } from '@playwright/test';

// Mock Playwright Page
const createMockPage = (): Page => {
  return {
    waitForTimeout: async (ms: number) => {
      // Mock implementation
    },
  } as any;
};

// Mock wallet helpers
const createMockWalletHelpers = () => {
  return {
    waitForTransaction: async (timeout?: number) => {
      // Mock implementation
    },
  };
};

describe('Transaction Builder', () => {
  let page: Page;
  let walletHelpers: any;

  beforeEach(() => {
    page = createMockPage();
    walletHelpers = createMockWalletHelpers();
  });

  describe('createTransactionBuilder', () => {
    it('should create a transaction builder instance', () => {
      const builder = createTransactionBuilder(page, walletHelpers);
      expect(builder).toBeInstanceOf(SuiTransactionBuilder);
    });

    it('should create with custom options', () => {
      const builder = createTransactionBuilder(page, walletHelpers, {
        timeout: 5000,
        gasbudget: 20_000_000,
      });
      expect(builder).toBeInstanceOf(SuiTransactionBuilder);
    });
  });

  describe('SuiTransactionBuilder', () => {
    let builder: SuiTransactionBuilder;

    beforeEach(() => {
      builder = createTransactionBuilder(page, walletHelpers);
    });

    describe('transfer', () => {
      it('should add transfer step', () => {
        builder.transfer('0x123', 100_000_000);
        const steps = builder.getSteps();

        expect(steps).toHaveLength(1);
        expect(steps[0].type).toBe('transfer');
        expect(steps[0].params.recipient).toBe('0x123');
        expect(steps[0].params.amount).toBe(100_000_000);
      });

      it('should support chaining', () => {
        const result = builder.transfer('0x123', 100_000_000);
        expect(result).toBe(builder);
      });
    });

    describe('split', () => {
      it('should add split step', () => {
        builder.split('0xabc', [50_000_000, 50_000_000]);
        const steps = builder.getSteps();

        expect(steps).toHaveLength(1);
        expect(steps[0].type).toBe('split');
        expect(steps[0].params.coinId).toBe('0xabc');
        expect(steps[0].params.amounts).toEqual([50_000_000, 50_000_000]);
      });

      it('should support chaining', () => {
        const result = builder.split('0xabc', [50, 50]);
        expect(result).toBe(builder);
      });
    });

    describe('merge', () => {
      it('should add merge step', () => {
        builder.merge('0x123', ['0xabc', '0xdef']);
        const steps = builder.getSteps();

        expect(steps).toHaveLength(1);
        expect(steps[0].type).toBe('merge');
        expect(steps[0].params.targetCoinId).toBe('0x123');
        expect(steps[0].params.sourceCoinIds).toEqual(['0xabc', '0xdef']);
      });

      it('should support chaining', () => {
        const result = builder.merge('0x123', ['0xabc']);
        expect(result).toBe(builder);
      });
    });

    describe('moveCall', () => {
      it('should add moveCall step without args', () => {
        builder.moveCall('0x2::coin::transfer');
        const steps = builder.getSteps();

        expect(steps).toHaveLength(1);
        expect(steps[0].type).toBe('moveCall');
        expect(steps[0].params.target).toBe('0x2::coin::transfer');
        expect(steps[0].params.typeArgs).toEqual([]);
        expect(steps[0].params.args).toEqual([]);
      });

      it('should add moveCall step with typeArgs and args', () => {
        builder.moveCall(
          '0x2::coin::transfer',
          ['0x2::sui::SUI'],
          ['0xabc', '0x123']
        );
        const steps = builder.getSteps();

        expect(steps[0].params.typeArgs).toEqual(['0x2::sui::SUI']);
        expect(steps[0].params.args).toEqual(['0xabc', '0x123']);
      });

      it('should support chaining', () => {
        const result = builder.moveCall('0x2::coin::transfer');
        expect(result).toBe(builder);
      });
    });

    describe('custom', () => {
      it('should add custom step', () => {
        const customFn = (tx: any) => tx;
        builder.custom(customFn);
        const steps = builder.getSteps();

        expect(steps).toHaveLength(1);
        expect(steps[0].type).toBe('custom');
        expect(steps[0].params.stepFn).toBe(customFn);
      });

      it('should support chaining', () => {
        const result = builder.custom((tx) => tx);
        expect(result).toBe(builder);
      });
    });

    describe('execute', () => {
      it('should execute transaction and return digest', async () => {
        builder.transfer('0x123', 100_000_000);
        const digest = await builder.execute();

        expect(digest).toMatch(/^0x[a-f0-9]+$/);
        expect(builder.getDigest()).toBe(digest);
      });

      it('should execute multiple steps', async () => {
        builder
          .transfer('0x123', 100_000_000)
          .split('0xabc', [50, 50])
          .merge('0xdef', ['0x111', '0x222']);

        const digest = await builder.execute();
        expect(digest).toMatch(/^0x[a-f0-9]+$/);
      });
    });

    describe('executeAndWait', () => {
      it('should execute and wait for confirmations', async () => {
        builder.transfer('0x123', 100_000_000);
        const digest = await builder.executeAndWait(1);

        expect(digest).toMatch(/^0x[a-f0-9]+$/);
      });
    });

    describe('reset', () => {
      it('should clear all steps', () => {
        builder.transfer('0x123', 100).split('0xabc', [50, 50]);
        expect(builder.getSteps()).toHaveLength(2);

        builder.reset();
        expect(builder.getSteps()).toHaveLength(0);
        expect(builder.getDigest()).toBeNull();
      });

      it('should support chaining', () => {
        const result = builder.reset();
        expect(result).toBe(builder);
      });
    });

    describe('getSteps', () => {
      it('should return copy of steps array', () => {
        builder.transfer('0x123', 100);
        const steps1 = builder.getSteps();
        const steps2 = builder.getSteps();

        expect(steps1).toEqual(steps2);
        expect(steps1).not.toBe(steps2); // Different array instances
      });
    });

    describe('chaining', () => {
      it('should support fluent API chaining', () => {
        const result = builder
          .transfer('0x123', 100_000_000)
          .split('0xabc', [50_000_000, 50_000_000])
          .merge('0xdef', ['0x111', '0x222'])
          .moveCall('0x2::coin::transfer', ['0x2::sui::SUI'], ['0xabc']);

        expect(result).toBe(builder);
        expect(builder.getSteps()).toHaveLength(4);
      });

      it('should allow reset and reuse', async () => {
        builder.transfer('0x123', 100);
        await builder.execute();

        builder.reset().transfer('0x456', 200);
        expect(builder.getSteps()).toHaveLength(1);
        expect(builder.getSteps()[0].params.recipient).toBe('0x456');
      });
    });
  });
});
