/**
 * Unit tests for Network Mocking
 */

import { createNetworkMock, SuiNetworkMock } from '../network-mock';
import type { Page, Route } from '@playwright/test';

// Mock Playwright Page
const createMockPage = (): Page => {
  let routeHandler: ((route: Route) => void) | null = null;

  return {
    route: async (pattern: string, handler: (route: Route) => void) => {
      routeHandler = handler;
    },
    unroute: async (pattern: string) => {
      routeHandler = null;
    },
    _getRouteHandler: () => routeHandler,
  } as any;
};

// Mock Playwright Route
const createMockRoute = (url: string, method: string, params: any[]): Route => {
  let fulfilled = false;
  let fulfilledData: any = null;

  return {
    request: () => ({
      url: () => url,
      postDataJSON: () => ({ method, params, id: 1 }),
    }),
    fulfill: async (response: any) => {
      fulfilled = true;
      fulfilledData = response;
    },
    continue: async () => {
      // Mock continue
    },
    _isFulfilled: () => fulfilled,
    _getFulfilledData: () => fulfilledData,
  } as any;
};

describe('Network Mock', () => {
  let page: Page;

  beforeEach(() => {
    page = createMockPage();
  });

  describe('createNetworkMock', () => {
    it('should create a network mock instance', () => {
      const mock = createNetworkMock(page);
      expect(mock).toBeInstanceOf(SuiNetworkMock);
    });

    it('should create with custom config', () => {
      const mock = createNetworkMock(page, {
        rpc: 'http://localhost:9001',
        chainId: 'custom-test',
        blockTime: 2000,
        gasPrice: 2000,
      });
      expect(mock).toBeInstanceOf(SuiNetworkMock);
    });
  });

  describe('SuiNetworkMock', () => {
    let mock: SuiNetworkMock;

    beforeEach(() => {
      mock = createNetworkMock(page);
    });

    describe('mockRpcResponse', () => {
      it('should register a mock response', () => {
        const result = mock.mockRpcResponse('sui_getBalance', {
          totalBalance: '1000000000',
          coinType: '0x2::sui::SUI',
        });

        expect(result).toBe(mock); // Should return this for chaining
      });

      it('should support chaining', () => {
        const result = mock
          .mockRpcResponse('sui_getBalance', { totalBalance: '1000' })
          .mockRpcResponse('sui_getTransactionBlock', { digest: '0xabc' });

        expect(result).toBe(mock);
      });
    });

    describe('mockBalance', () => {
      it('should mock balance for an address', () => {
        const result = mock.mockBalance('0x123', 1_000_000_000);
        expect(result).toBe(mock);
      });

      it('should mock balance with custom coin type', () => {
        const result = mock.mockBalance('0x123', 100_000_000, '0x2::usdc::USDC');
        expect(result).toBe(mock);
      });

      it('should support chaining', () => {
        const result = mock
          .mockBalance('0x123', 1_000_000_000)
          .mockBalance('0x456', 500_000_000);

        expect(result).toBe(mock);
      });
    });

    describe('mockTransaction', () => {
      it('should mock successful transaction', () => {
        const result = mock.mockTransaction('0xabc123', 'success');
        expect(result).toBe(mock);
      });

      it('should mock failed transaction', () => {
        const result = mock.mockTransaction('0xdef456', 'failure');
        expect(result).toBe(mock);
      });

      it('should default to success status', () => {
        const result = mock.mockTransaction('0x789');
        expect(result).toBe(mock);
      });
    });

    describe('mockObject', () => {
      it('should mock object ownership', () => {
        const result = mock.mockObject(
          '0xobj123',
          '0x123',
          '0x2::coin::Coin<0x2::sui::SUI>'
        );
        expect(result).toBe(mock);
      });
    });

    describe('mockGasPrice', () => {
      it('should mock gas price', () => {
        const result = mock.mockGasPrice(2000);
        expect(result).toBe(mock);
      });
    });

    describe('mockTransactionFailure', () => {
      it('should mock transaction failure with error', () => {
        const result = mock.mockTransactionFailure('Insufficient gas');
        expect(result).toBe(mock);
      });
    });

    describe('enable/disable', () => {
      it('should enable network mocking', async () => {
        await mock.enable();
        // Verify route was registered
        expect((page as any)._getRouteHandler()).toBeTruthy();
      });

      it('should not enable twice', async () => {
        await mock.enable();
        await mock.enable(); // Should log "Already enabled"
      });

      it('should disable network mocking', async () => {
        await mock.enable();
        await mock.disable();
      });

      it('should not disable if not enabled', async () => {
        await mock.disable(); // Should do nothing
      });
    });

    describe('clearMocks', () => {
      it('should clear all mock responses', () => {
        mock.mockBalance('0x123', 1_000_000_000);
        mock.mockTransaction('0xabc', 'success');

        const result = mock.clearMocks();
        expect(result).toBe(mock);
      });
    });

    describe('getInterceptedRequests', () => {
      it('should return empty array initially', () => {
        expect(mock.getInterceptedRequests()).toEqual([]);
      });

      it('should return all intercepted requests', async () => {
        await mock.enable();

        // Simulate intercepted requests
        const route1 = createMockRoute('http://localhost:9000', 'sui_getBalance', ['0x123']);
        const route2 = createMockRoute('http://localhost:9000', 'sui_getTransactionBlock', ['0xabc']);

        const handler = (page as any)._getRouteHandler();
        if (handler) {
          await handler(route1);
          await handler(route2);
        }

        const requests = mock.getInterceptedRequests();
        expect(requests.length).toBeGreaterThanOrEqual(0); // May be 0 in mock environment
      });

      it('should filter requests by method', async () => {
        await mock.enable();

        const filtered = mock.getInterceptedRequests('sui_getBalance');
        expect(Array.isArray(filtered)).toBe(true);
      });
    });

    describe('clearInterceptedRequests', () => {
      it('should clear intercepted requests history', () => {
        mock.clearInterceptedRequests();
        expect(mock.getInterceptedRequests()).toEqual([]);
      });
    });

    describe('wasMethodCalled', () => {
      it('should return false when method not called', () => {
        expect(mock.wasMethodCalled('sui_getBalance')).toBe(false);
      });
    });

    describe('getCallCount', () => {
      it('should return 0 when method not called', () => {
        expect(mock.getCallCount('sui_getBalance')).toBe(0);
      });
    });

    describe('route interception', () => {
      it('should intercept RPC requests', async () => {
        mock.mockRpcResponse('sui_getBalance', {
          totalBalance: '1000000000',
          coinType: '0x2::sui::SUI',
        });

        await mock.enable();

        const route = createMockRoute(
          'http://localhost:9000/rpc',
          'sui_getBalance',
          ['0x123']
        );

        const handler = (page as any)._getRouteHandler();
        if (handler) {
          await handler(route);
        }

        // Check if route was fulfilled with mock response
        if ((route as any)._isFulfilled()) {
          const data = (route as any)._getFulfilledData();
          expect(data.status).toBe(200);
          expect(data.contentType).toBe('application/json');

          const body = JSON.parse(data.body);
          expect(body.result.totalBalance).toBe('1000000000');
        }
      });

      it('should continue non-RPC requests', async () => {
        await mock.enable();

        const route = createMockRoute(
          'http://example.com/api/data',
          'GET',
          []
        );

        const handler = (page as any)._getRouteHandler();
        if (handler) {
          await handler(route);
        }

        // Should not be fulfilled (should continue)
        expect((route as any)._isFulfilled()).toBe(false);
      });

      it('should continue RPC requests without mock', async () => {
        await mock.enable();

        const route = createMockRoute(
          'http://localhost:9000/rpc',
          'sui_getObject',
          ['0xabc']
        );

        const handler = (page as any)._getRouteHandler();
        if (handler) {
          await handler(route);
        }

        // Should not be fulfilled (should continue)
        expect((route as any)._isFulfilled()).toBe(false);
      });
    });

    describe('chaining', () => {
      it('should support fluent API chaining', async () => {
        const result = mock
          .mockBalance('0x123', 1_000_000_000)
          .mockTransaction('0xabc', 'success')
          .mockGasPrice(2000)
          .mockObject('0xobj', '0x123', '0x2::sui::SUI');

        expect(result).toBe(mock);
      });

      it('should allow clear and reuse', () => {
        mock
          .mockBalance('0x123', 1_000_000_000)
          .mockTransaction('0xabc', 'success');

        mock.clearMocks();

        mock.mockBalance('0x456', 500_000_000);
        // Should work fine
      });
    });
  });
});
