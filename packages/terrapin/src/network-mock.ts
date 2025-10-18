/**
 * Network Mocking for Sui blockchain testing
 *
 * Provides utilities to mock network responses for faster, deterministic tests
 */

import type { Page, Route } from '@playwright/test';

export interface NetworkMockConfig {
  rpc?: string;
  chainId?: string;
  blockTime?: number;
  gasPrice?: number;
}

export interface MockResponse {
  method: string;
  response: any;
}

/**
 * Network Mock - Mock Sui RPC responses for testing
 *
 * @example
 * ```typescript
 * const mock = createNetworkMock(page);
 *
 * await mock.mockRpcResponse('sui_getBalance', {
 *   totalBalance: '1000000000',
 *   coinType: '0x2::sui::SUI'
 * });
 *
 * await mock.enable();
 * ```
 */
export class SuiNetworkMock {
  private mockResponses: Map<string, any> = new Map();
  private interceptedRequests: any[] = [];
  private enabled: boolean = false;

  constructor(
    private page: Page,
    private config: NetworkMockConfig = {}
  ) {
    this.config = {
      rpc: config.rpc || 'http://localhost:9000',
      chainId: config.chainId || 'local-test',
      blockTime: config.blockTime || 1000,
      gasPrice: config.gasPrice || 1000,
    };
  }

  /**
   * Mock a specific RPC method response
   *
   * @param method - RPC method name
   * @param response - Mock response data
   *
   * @example
   * ```typescript
   * mock.mockRpcResponse('sui_getBalance', {
   *   totalBalance: '1000000000',
   *   coinType: '0x2::sui::SUI'
   * });
   * ```
   */
  mockRpcResponse(method: string, response: any): this {
    console.log(`[terrapin:network-mock] Mocking RPC method: ${method}`);
    this.mockResponses.set(method, response);
    return this;
  }

  /**
   * Mock balance for an address
   *
   * @param address - Wallet address
   * @param balance - Balance in MIST
   * @param coinType - Coin type (default: SUI)
   *
   * @example
   * ```typescript
   * mock.mockBalance('0x123...', 1_000_000_000); // 1 SUI
   * ```
   */
  mockBalance(address: string, balance: number, coinType: string = '0x2::sui::SUI'): this {
    return this.mockRpcResponse('sui_getBalance', {
      totalBalance: balance.toString(),
      coinType,
      coinObjectCount: 1,
    });
  }

  /**
   * Mock transaction result
   *
   * @param digest - Transaction digest
   * @param status - Transaction status ('success' | 'failure')
   *
   * @example
   * ```typescript
   * mock.mockTransaction('0xabc...', 'success');
   * ```
   */
  mockTransaction(digest: string, status: 'success' | 'failure' = 'success'): this {
    return this.mockRpcResponse('sui_getTransactionBlock', {
      digest,
      effects: {
        status: { status },
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Mock object ownership
   *
   * @param objectId - Object ID
   * @param owner - Owner address
   * @param objectType - Object type
   *
   * @example
   * ```typescript
   * mock.mockObject('0xobj123', '0x123...', '0x2::coin::Coin<0x2::sui::SUI>');
   * ```
   */
  mockObject(objectId: string, owner: string, objectType: string): this {
    return this.mockRpcResponse('sui_getObject', {
      objectId,
      owner: { AddressOwner: owner },
      type: objectType,
    });
  }

  /**
   * Mock gas price
   *
   * @param price - Gas price in MIST
   *
   * @example
   * ```typescript
   * mock.mockGasPrice(1000);
   * ```
   */
  mockGasPrice(price: number): this {
    this.config.gasPrice = price;
    return this.mockRpcResponse('sui_getReferenceGasPrice', price);
  }

  /**
   * Enable network mocking
   *
   * @example
   * ```typescript
   * await mock.enable();
   * ```
   */
  async enable(): Promise<void> {
    if (this.enabled) {
      console.log('[terrapin:network-mock] Already enabled');
      return;
    }

    console.log('[terrapin:network-mock] Enabling network mocking');

    await this.page.route('**/*', (route: Route) => {
      const request = route.request();
      const url = request.url();

      // Only intercept RPC requests
      if (!url.includes('/rpc') && !url.includes(':9000')) {
        return route.continue();
      }

      const postData = request.postDataJSON();
      const method = postData?.method;

      // Log intercepted request
      this.interceptedRequests.push({
        url,
        method,
        params: postData?.params,
        timestamp: Date.now(),
      });

      console.log(`[terrapin:network-mock] Intercepted RPC: ${method}`);

      // Return mock response if available
      if (method && this.mockResponses.has(method)) {
        const mockResponse = this.mockResponses.get(method);

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: postData?.id || 1,
            result: mockResponse,
          }),
        });
      }

      // Continue with real request if no mock
      return route.continue();
    });

    this.enabled = true;
    console.log('[terrapin:network-mock] Network mocking enabled');
  }

  /**
   * Disable network mocking
   *
   * @example
   * ```typescript
   * await mock.disable();
   * ```
   */
  async disable(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    console.log('[terrapin:network-mock] Disabling network mocking');
    await this.page.unroute('**/*');
    this.enabled = false;
  }

  /**
   * Clear all mock responses
   */
  clearMocks(): this {
    console.log('[terrapin:network-mock] Clearing all mocks');
    this.mockResponses.clear();
    return this;
  }

  /**
   * Get intercepted requests
   *
   * @param method - Filter by RPC method (optional)
   *
   * @example
   * ```typescript
   * const requests = mock.getInterceptedRequests('sui_getBalance');
   * ```
   */
  getInterceptedRequests(method?: string): any[] {
    if (!method) {
      return [...this.interceptedRequests];
    }
    return this.interceptedRequests.filter(req => req.method === method);
  }

  /**
   * Clear intercepted requests history
   */
  clearInterceptedRequests(): void {
    this.interceptedRequests = [];
  }

  /**
   * Check if a specific method was called
   *
   * @param method - RPC method name
   *
   * @example
   * ```typescript
   * const wasCalled = mock.wasMethodCalled('sui_getBalance');
   * ```
   */
  wasMethodCalled(method: string): boolean {
    return this.interceptedRequests.some(req => req.method === method);
  }

  /**
   * Get call count for a method
   *
   * @param method - RPC method name
   */
  getCallCount(method: string): number {
    return this.interceptedRequests.filter(req => req.method === method).length;
  }

  /**
   * Mock a failed transaction
   *
   * @param errorMessage - Error message
   *
   * @example
   * ```typescript
   * mock.mockTransactionFailure('Insufficient gas');
   * ```
   */
  mockTransactionFailure(errorMessage: string): this {
    return this.mockRpcResponse('sui_executeTransactionBlock', {
      error: {
        code: -32000,
        message: errorMessage,
      },
    });
  }

  /**
   * Mock network delay
   *
   * @param method - RPC method to delay
   * @param delayMs - Delay in milliseconds
   *
   * @example
   * ```typescript
   * mock.mockDelay('sui_executeTransactionBlock', 3000); // 3 second delay
   * ```
   */
  async mockDelay(method: string, delayMs: number): Promise<void> {
    const originalResponse = this.mockResponses.get(method);

    // Wrap response with delay
    this.mockRpcResponse(method, async () => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return originalResponse;
    });
  }
}

/**
 * Create a network mock instance
 *
 * @param page - Playwright page
 * @param config - Network configuration
 *
 * @example
 * ```typescript
 * const mock = createNetworkMock(page, { chainId: 'test' });
 * await mock.mockBalance('0x123', 1_000_000_000);
 * await mock.enable();
 * ```
 */
export function createNetworkMock(
  page: Page,
  config?: NetworkMockConfig
): SuiNetworkMock {
  return new SuiNetworkMock(page, config);
}
