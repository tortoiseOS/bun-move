/**
 * Hook for fetching Sui and custom coin balances
 */

import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";

export interface UseBalanceConfig {
  address?: string;
  coinType?: string;
  watch?: boolean;
}

export function useBalance(config: UseBalanceConfig = {}) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const address = config.address || currentAccount?.address;

  return useQuery({
    queryKey: ["balance", address, config.coinType],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address provided");
      }

      const balance = await client.getBalance({
        owner: address,
        coinType: config.coinType,
      });

      return {
        value: BigInt(balance.totalBalance),
        formatted: (
          Number(balance.totalBalance) / 1_000_000_000
        ).toFixed(9),
        symbol: balance.coinType.split("::").pop() || "SUI",
        decimals: 9,
      };
    },
    enabled: !!address,
    refetchInterval: config.watch ? 4000 : false,
  });
}

/**
 * Hook to get all coin balances for an address
 */
export function useAllBalances(address?: string) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const effectiveAddress = address || currentAccount?.address;

  return useQuery({
    queryKey: ["all-balances", effectiveAddress],
    queryFn: async () => {
      if (!effectiveAddress) {
        throw new Error("No address provided");
      }

      const balances = await client.getAllBalances({
        owner: effectiveAddress,
      });

      return balances.map((b) => ({
        coinType: b.coinType,
        value: BigInt(b.totalBalance),
        formatted: (Number(b.totalBalance) / 1_000_000_000).toFixed(9),
        symbol: b.coinType.split("::").pop() || "UNKNOWN",
      }));
    },
    enabled: !!effectiveAddress,
  });
}

/**
 * Hook specifically for SUI balance
 */
export function useSuiBalance(address?: string) {
  return useBalance({ address, coinType: "0x2::sui::SUI", watch: true });
}
