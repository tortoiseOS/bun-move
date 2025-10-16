/**
 * Hook to get deployed contract information
 * Similar to bun-eth's useDeployedContractInfo
 */

import { useMemo } from "react";
import deployedContracts from "@bun-move/move/deployedContracts";
import type { NetworkType } from "@bun-move/core";

export interface DeployedContractInfo {
  packageId: string;
  modules: string[];
  network: string;
  deployedAt: number;
}

export function useDeployedContract(
  contractName: string,
  network?: NetworkType
): DeployedContractInfo | null {
  return useMemo(() => {
    const effectiveNetwork = network || "localnet";
    const contracts = deployedContracts[effectiveNetwork];

    if (!contracts || !contracts[contractName]) {
      console.warn(
        `Contract "${contractName}" not found on network "${effectiveNetwork}"`
      );
      return null;
    }

    return contracts[contractName];
  }, [contractName, network]);
}

export function useDeployedContracts(
  network?: NetworkType
): Record<string, DeployedContractInfo> {
  return useMemo(() => {
    const effectiveNetwork = network || "localnet";
    return deployedContracts[effectiveNetwork] || {};
  }, [network]);
}
