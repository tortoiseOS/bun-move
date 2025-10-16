/**
 * Hook to get contract interface for type-safe interactions
 */

import { useMemo } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useDeployedContract } from "./useDeployedContract";
import type { NetworkType } from "@bun-move/core";

export interface TortoiseContract {
  packageId: string;
  modules: string[];
  network: string;

  /**
   * Build move call target
   * @example buildTarget("pool", "swap_a_to_b") => "0xabc...::pool::swap_a_to_b"
   */
  buildTarget: (module: string, functionName: string) => string;
}

export function useTortoiseContract(
  contractName: string,
  network?: NetworkType
): TortoiseContract | null {
  const client = useSuiClient();
  const deployed = useDeployedContract(contractName, network);

  return useMemo(() => {
    if (!deployed) return null;

    return {
      packageId: deployed.packageId,
      modules: deployed.modules,
      network: deployed.network,
      buildTarget: (module: string, functionName: string) => {
        return `${deployed.packageId}::${module}::${functionName}`;
      },
    };
  }, [deployed, client]);
}
