/**
 * Unit tests for Event Listener
 */

import { createEventListener, SuiEventListener } from '../event-listener';
import type { Page } from '@playwright/test';
import type { SuiEvent } from '../event-listener';

// Mock Playwright Page
const createMockPage = (): Page => {
  let exposedFunctions: Map<string, Function> = new Map();

  return {
    exposeFunction: async (name: string, callback: Function) => {
      exposedFunctions.set(name, callback);
    },
    _getExposedFunction: (name: string) => exposedFunctions.get(name),
  } as any;
};

describe('Event Listener', () => {
  let page: Page;

  beforeEach(() => {
    page = createMockPage();
  });

  describe('createEventListener', () => {
    it('should create an event listener instance', () => {
      const listener = createEventListener(page);
      expect(listener).toBeInstanceOf(SuiEventListener);
    });

    it('should create with custom options', () => {
      const listener = createEventListener(page, {
        timeout: 5000,
        pollInterval: 1000,
      });
      expect(listener).toBeInstanceOf(SuiEventListener);
    });
  });

  describe('SuiEventListener', () => {
    let listener: SuiEventListener;

    beforeEach(() => {
      listener = createEventListener(page);
    });

    describe('getEvents', () => {
      it('should return empty array initially', () => {
        expect(listener.getEvents()).toEqual([]);
      });

      it('should return all events when no filter', () => {
        // Manually emit events for testing
        const event1: SuiEvent = { type: 'Transfer', sender: '0x123' };
        const event2: SuiEvent = { type: 'ObjectCreated', sender: '0x456' };

        (listener as any).emitEvent(event1);
        (listener as any).emitEvent(event2);

        const events = listener.getEvents();
        expect(events).toHaveLength(2);
      });

      it('should filter events by type', () => {
        const event1: SuiEvent = { type: 'Transfer', sender: '0x123' };
        const event2: SuiEvent = { type: 'ObjectCreated', sender: '0x456' };
        const event3: SuiEvent = { type: 'Transfer', sender: '0x789' };

        (listener as any).emitEvent(event1);
        (listener as any).emitEvent(event2);
        (listener as any).emitEvent(event3);

        const transfers = listener.getEvents('Transfer');
        expect(transfers).toHaveLength(2);
        expect(transfers[0].type).toBe('Transfer');
        expect(transfers[1].type).toBe('Transfer');
      });

      it('should return a copy of events array', () => {
        const event: SuiEvent = { type: 'Transfer', sender: '0x123' };
        (listener as any).emitEvent(event);

        const events1 = listener.getEvents();
        const events2 = listener.getEvents();

        expect(events1).toEqual(events2);
        expect(events1).not.toBe(events2); // Different array instances
      });
    });

    describe('getLastEvent', () => {
      it('should return null when no events', () => {
        expect(listener.getLastEvent('Transfer')).toBeNull();
      });

      it('should return the last event of a type', () => {
        const event1: SuiEvent = { type: 'Transfer', sender: '0x123' };
        const event2: SuiEvent = { type: 'Transfer', sender: '0x456' };
        const event3: SuiEvent = { type: 'ObjectCreated', sender: '0x789' };

        (listener as any).emitEvent(event1);
        (listener as any).emitEvent(event2);
        (listener as any).emitEvent(event3);

        const lastTransfer = listener.getLastEvent('Transfer');
        expect(lastTransfer?.sender).toBe('0x456');
      });
    });

    describe('hasEvent', () => {
      it('should return false when no events', () => {
        expect(listener.hasEvent('Transfer')).toBe(false);
      });

      it('should return true when event exists', () => {
        const event: SuiEvent = { type: 'Transfer', sender: '0x123' };
        (listener as any).emitEvent(event);

        expect(listener.hasEvent('Transfer')).toBe(true);
        expect(listener.hasEvent('ObjectCreated')).toBe(false);
      });

      it('should support filter function', () => {
        const event1: SuiEvent = { type: 'Transfer', sender: '0x123', parsedJson: { amount: 100 } };
        const event2: SuiEvent = { type: 'Transfer', sender: '0x456', parsedJson: { amount: 200 } };

        (listener as any).emitEvent(event1);
        (listener as any).emitEvent(event2);

        const hasLargeTransfer = listener.hasEvent(
          'Transfer',
          (e) => e.parsedJson?.amount > 150
        );
        expect(hasLargeTransfer).toBe(true);

        const hasVeryLargeTransfer = listener.hasEvent(
          'Transfer',
          (e) => e.parsedJson?.amount > 300
        );
        expect(hasVeryLargeTransfer).toBe(false);
      });
    });

    describe('getEventCount', () => {
      it('should return 0 initially', () => {
        expect(listener.getEventCount()).toBe(0);
      });

      it('should count all events', () => {
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        (listener as any).emitEvent({ type: 'ObjectCreated', sender: '0x456' });

        expect(listener.getEventCount()).toBe(2);
      });

      it('should count events by type', () => {
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x456' });
        (listener as any).emitEvent({ type: 'ObjectCreated', sender: '0x789' });

        expect(listener.getEventCount('Transfer')).toBe(2);
        expect(listener.getEventCount('ObjectCreated')).toBe(1);
        expect(listener.getEventCount('Unknown')).toBe(0);
      });
    });

    describe('waitForEvent', () => {
      it('should resolve when event is emitted', async () => {
        const eventPromise = listener.waitForEvent('Transfer', { timeout: 1000 });

        setTimeout(() => {
          (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        }, 100);

        const event = await eventPromise;
        expect(event.type).toBe('Transfer');
        expect(event.sender).toBe('0x123');
      });

      it('should resolve immediately if event already exists', async () => {
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });

        const event = await listener.waitForEvent('Transfer', { timeout: 1000 });
        expect(event.type).toBe('Transfer');
      });

      it('should timeout if event not emitted', async () => {
        await expect(
          listener.waitForEvent('Transfer', { timeout: 100 })
        ).rejects.toThrow('Timeout waiting for event: Transfer');
      });

      it('should support filter function', async () => {
        const eventPromise = listener.waitForEvent('Transfer', {
          timeout: 1000,
          filter: (e) => e.parsedJson?.amount > 100,
        });

        setTimeout(() => {
          (listener as any).emitEvent({
            type: 'Transfer',
            sender: '0x123',
            parsedJson: { amount: 50 },
          });
        }, 100);

        setTimeout(() => {
          (listener as any).emitEvent({
            type: 'Transfer',
            sender: '0x456',
            parsedJson: { amount: 200 },
          });
        }, 200);

        const event = await eventPromise;
        expect(event.parsedJson?.amount).toBe(200);
      });
    });

    describe('waitForEvents', () => {
      it('should wait for multiple event types', async () => {
        const eventsPromise = listener.waitForEvents(['Transfer', 'ObjectCreated'], {
          timeout: 1000,
        });

        setTimeout(() => {
          (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
          (listener as any).emitEvent({ type: 'ObjectCreated', sender: '0x456' });
        }, 100);

        const events = await eventsPromise;
        expect(events).toHaveLength(2);
        expect(events[0].type).toBe('Transfer');
        expect(events[1].type).toBe('ObjectCreated');
      });
    });

    describe('on/off', () => {
      it('should call callback when event is emitted', () => {
        const callback = jest.fn();
        listener.on('Transfer', callback);

        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'Transfer', sender: '0x123' })
        );
      });

      it('should support wildcard listener', () => {
        const callback = jest.fn();
        listener.on('*', callback);

        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        (listener as any).emitEvent({ type: 'ObjectCreated', sender: '0x456' });

        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should remove callback with off', () => {
        const callback = jest.fn();
        listener.on('Transfer', callback);

        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        expect(callback).toHaveBeenCalledTimes(1);

        listener.off('Transfer', callback);
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x456' });
        expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
      });
    });

    describe('clearEvents', () => {
      it('should clear all events', () => {
        (listener as any).emitEvent({ type: 'Transfer', sender: '0x123' });
        (listener as any).emitEvent({ type: 'ObjectCreated', sender: '0x456' });

        expect(listener.getEvents()).toHaveLength(2);

        listener.clearEvents();
        expect(listener.getEvents()).toHaveLength(0);
      });
    });
  });
});
