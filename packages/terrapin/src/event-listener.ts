/**
 * Event Listener for Sui blockchain events in tests
 *
 * Provides utilities to wait for and verify blockchain events
 */

import type { Page } from '@playwright/test';

export interface SuiEvent {
  type: string;
  packageId?: string;
  transactionModule?: string;
  sender?: string;
  timestamp?: number;
  parsedJson?: Record<string, any>;
}

export interface EventListenerOptions {
  timeout?: number;
  pollInterval?: number;
}

/**
 * Event Listener - Wait for specific blockchain events
 *
 * @example
 * ```typescript
 * const listener = createEventListener(page);
 *
 * await listener.waitForEvent('Transfer', { timeout: 5000 });
 * const events = listener.getEvents('ObjectCreated');
 * ```
 */
export class SuiEventListener {
  private events: SuiEvent[] = [];
  private eventCallbacks: Map<string, ((event: SuiEvent) => void)[]> = new Map();

  constructor(
    private page: Page,
    private options: EventListenerOptions = {}
  ) {
    this.options = {
      timeout: options.timeout || 10000,
      pollInterval: options.pollInterval || 500,
    };

    // Start listening for events
    this.startListening();
  }

  /**
   * Start listening for events on the page
   */
  private startListening(): void {
    console.log('[terrapin:events] Started listening for Sui events');

    // In a real implementation, this would hook into the Sui client
    // For testing, we'll expose a method to manually emit events
    this.page.exposeFunction('__terrapin_emitEvent', (event: SuiEvent) => {
      this.emitEvent(event);
    });
  }

  /**
   * Emit an event (internal use and testing)
   */
  private emitEvent(event: SuiEvent): void {
    console.log('[terrapin:events] Event emitted:', event.type, event);

    this.events.push(event);

    // Call registered callbacks
    const callbacks = this.eventCallbacks.get(event.type) || [];
    callbacks.forEach(cb => cb(event));

    // Call wildcard callbacks
    const wildcardCallbacks = this.eventCallbacks.get('*') || [];
    wildcardCallbacks.forEach(cb => cb(event));
  }

  /**
   * Wait for a specific event type
   *
   * @param eventType - Type of event to wait for
   * @param options - Wait options
   *
   * @example
   * ```typescript
   * await listener.waitForEvent('Transfer', { timeout: 5000 });
   * ```
   */
  async waitForEvent(
    eventType: string,
    options: { timeout?: number; filter?: (event: SuiEvent) => boolean } = {}
  ): Promise<SuiEvent> {
    const timeout = options.timeout || this.options.timeout!;
    const filter = options.filter || (() => true);

    console.log(`[terrapin:events] Waiting for event: ${eventType} (timeout: ${timeout}ms)`);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeout);

      const callback = (event: SuiEvent) => {
        if (filter(event)) {
          clearTimeout(timeoutId);
          resolve(event);
        }
      };

      // Register callback
      const callbacks = this.eventCallbacks.get(eventType) || [];
      callbacks.push(callback);
      this.eventCallbacks.set(eventType, callbacks);

      // Check existing events
      const existingEvent = this.events
        .filter(e => e.type === eventType)
        .find(filter);

      if (existingEvent) {
        clearTimeout(timeoutId);
        resolve(existingEvent);
      }
    });
  }

  /**
   * Wait for multiple events
   *
   * @param eventTypes - Array of event types to wait for
   * @param options - Wait options
   *
   * @example
   * ```typescript
   * const events = await listener.waitForEvents(['Transfer', 'ObjectCreated']);
   * ```
   */
  async waitForEvents(
    eventTypes: string[],
    options: { timeout?: number } = {}
  ): Promise<SuiEvent[]> {
    const promises = eventTypes.map(type => this.waitForEvent(type, options));
    return Promise.all(promises);
  }

  /**
   * Get all captured events of a specific type
   *
   * @param eventType - Type of event (optional, returns all if not specified)
   *
   * @example
   * ```typescript
   * const transfers = listener.getEvents('Transfer');
   * const allEvents = listener.getEvents();
   * ```
   */
  getEvents(eventType?: string): SuiEvent[] {
    if (!eventType) {
      return [...this.events];
    }
    return this.events.filter(e => e.type === eventType);
  }

  /**
   * Get the last event of a specific type
   *
   * @param eventType - Type of event
   *
   * @example
   * ```typescript
   * const lastTransfer = listener.getLastEvent('Transfer');
   * ```
   */
  getLastEvent(eventType: string): SuiEvent | null {
    const events = this.getEvents(eventType);
    return events[events.length - 1] || null;
  }

  /**
   * Register a callback for an event type
   *
   * @param eventType - Event type or '*' for all events
   * @param callback - Callback function
   *
   * @example
   * ```typescript
   * listener.on('Transfer', (event) => {
   *   console.log('Transfer event:', event);
   * });
   * ```
   */
  on(eventType: string, callback: (event: SuiEvent) => void): void {
    const callbacks = this.eventCallbacks.get(eventType) || [];
    callbacks.push(callback);
    this.eventCallbacks.set(eventType, callbacks);
  }

  /**
   * Remove a callback for an event type
   *
   * @param eventType - Event type
   * @param callback - Callback to remove
   */
  off(eventType: string, callback: (event: SuiEvent) => void): void {
    const callbacks = this.eventCallbacks.get(eventType) || [];
    const filtered = callbacks.filter(cb => cb !== callback);
    this.eventCallbacks.set(eventType, filtered);
  }

  /**
   * Clear all captured events
   */
  clearEvents(): void {
    this.events = [];
    console.log('[terrapin:events] Cleared all events');
  }

  /**
   * Check if an event has been emitted
   *
   * @param eventType - Event type to check
   * @param filter - Optional filter function
   *
   * @example
   * ```typescript
   * const hasTransfer = listener.hasEvent('Transfer');
   * const hasLargeTransfer = listener.hasEvent('Transfer', e => e.amount > 1000);
   * ```
   */
  hasEvent(eventType: string, filter?: (event: SuiEvent) => boolean): boolean {
    const events = this.getEvents(eventType);
    if (!filter) {
      return events.length > 0;
    }
    return events.some(filter);
  }

  /**
   * Get event count
   *
   * @param eventType - Event type (optional)
   */
  getEventCount(eventType?: string): number {
    return this.getEvents(eventType).length;
  }
}

/**
 * Create an event listener instance
 *
 * @param page - Playwright page
 * @param options - Listener options
 *
 * @example
 * ```typescript
 * const listener = createEventListener(page);
 * await listener.waitForEvent('Transfer');
 * ```
 */
export function createEventListener(
  page: Page,
  options?: EventListenerOptions
): SuiEventListener {
  return new SuiEventListener(page, options);
}
