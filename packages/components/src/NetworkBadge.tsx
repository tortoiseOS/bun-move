/**
 * Component for displaying current network
 */

import { Badge } from "@radix-ui/themes";
import type { NetworkType } from "@bun-move/core";

export interface NetworkBadgeProps {
  network: NetworkType;
}

const NETWORK_COLORS = {
  localnet: "gray",
  devnet: "blue",
  testnet: "orange",
  mainnet: "green",
} as const;

export function NetworkBadge({ network }: NetworkBadgeProps) {
  return (
    <Badge color={NETWORK_COLORS[network]} variant="soft">
      {network.charAt(0).toUpperCase() + network.slice(1)}
    </Badge>
  );
}
