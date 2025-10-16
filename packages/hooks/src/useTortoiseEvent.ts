/**
 * Hook for watching Move contract events
 */

import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useTortoiseContract } from "./useTortoiseContract";
import type { NetworkType } from "@bun-move/core";

export interface UseTortoiseEventConfig {
  contractName: string;
  module: string;
  eventType: string;
  network?: NetworkType;
  enabled?: boolean;
  onEvent?: (event: any) => void;
}

export function useTortoiseEvent(config: UseTortoiseEventConfig) {
  const client = useSuiClient();
  const contract = useTortoiseContract(config.contractName, config.network);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contract || config.enabled === false) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        const eventType = `${contract.packageId}::${config.module}::${config.eventType}`;

        const result = await client.queryEvents({
          query: { MoveEventType: eventType },
          order: "descending",
          limit: 50,
        });

        if (!isCancelled) {
          setEvents(result.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    // Poll for new events every 5 seconds
    const interval = setInterval(fetchEvents, 5000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [client, contract, config.module, config.eventType, config.enabled]);

  // Trigger callback when new events arrive
  useEffect(() => {
    if (config.onEvent && events.length > 0) {
      events.forEach((event) => config.onEvent!(event));
    }
  }, [events, config.onEvent]);

  return {
    events,
    isLoading,
    latestEvent: events[0] || null,
  };
}

/**
 * Hook to subscribe to real-time events (WebSocket)
 */
export function useTortoiseEventSubscription(config: UseTortoiseEventConfig) {
  const contract = useTortoiseContract(config.contractName, config.network);
  const [latestEvent, setLatestEvent] = useState<any>(null);

  useEffect(() => {
    if (!contract || config.enabled === false) return;

    // TODO: Implement WebSocket subscription when Sui SDK supports it
    // For now, use polling via useTortoiseEvent
    console.warn("WebSocket event subscription not yet implemented");
  }, [contract, config.enabled]);

  return {
    latestEvent,
  };
}
