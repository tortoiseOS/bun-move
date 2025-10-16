/**
 * Hook for reading from Move contracts
 * Similar to wagmi's useReadContract
 */

import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { useTortoiseContract } from "./useTortoiseContract";
import type { NetworkType } from "@bun-move/core";

export interface UseTortoiseReadConfig {
  contractName: string;
  module: string;
  functionName: string;
  args?: any[];
  typeArgs?: string[];
  network?: NetworkType;
  enabled?: boolean;
  watch?: boolean; // Auto-refetch every 4s
}

export function useTortoiseRead<T = any>(config: UseTortoiseReadConfig) {
  const client = useSuiClient();
  const contract = useTortoiseContract(config.contractName, config.network);

  const target = contract?.buildTarget(config.module, config.functionName);

  return useQuery({
    queryKey: [
      "tortoise-read",
      target,
      config.args,
      config.typeArgs,
    ],
    queryFn: async () => {
      if (!target) {
        throw new Error(
          `Contract "${config.contractName}" not deployed on this network`
        );
      }

      // For view functions, we use devInspectTransactionBlock
      const tx = {
        kind: "moveCall" as const,
        target,
        arguments: config.args || [],
        typeArguments: config.typeArgs || [],
      };

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx as any,
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      if (result.error) {
        throw new Error(`Contract call failed: ${result.error}`);
      }

      // Parse return values
      return result.results?.[0]?.returnValues as T;
    },
    enabled: config.enabled !== false && !!contract,
    refetchInterval: config.watch ? 4000 : false,
  });
}

/**
 * Simplified hook for common read patterns
 */
export function useContractView<T = any>(
  contractName: string,
  module: string,
  functionName: string,
  args?: any[],
  options?: { watch?: boolean; enabled?: boolean }
) {
  return useTortoiseRead<T>({
    contractName,
    module,
    functionName,
    args,
    ...options,
  });
}
