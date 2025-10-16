/**
 * Hook for TortoiseVault interactions
 */

import { useTortoiseRead, useTortoiseWrite } from "./index";

export interface Vault {
  id: string;
  totalBalance: bigint;
  totalShares: bigint;
  activeStrategyId: number;
  lastCompound: number;
}

export function useVault(vaultId: string) {
  // Read vault state
  const { data: vaultData, isLoading } = useTortoiseRead<Vault>({
    contractName: "vault",
    module: "auto_compounder",
    functionName: "get_vault",
    args: [vaultId],
    watch: true,
  });

  // Write operations
  const deposit = useTortoiseWrite({
    contractName: "vault",
    module: "auto_compounder",
    functionName: "deposit",
  });

  const withdraw = useTortoiseWrite({
    contractName: "vault",
    module: "auto_compounder",
    functionName: "withdraw",
  });

  // Calculate share value
  const calculateShareValue = (shares: bigint) => {
    if (!vaultData || vaultData.totalShares === BigInt(0)) return BigInt(0);
    return (shares * vaultData.totalBalance) / vaultData.totalShares;
  };

  // Calculate APY (simplified - would need historical data in production)
  const estimatedAPY = vaultData ? 15.5 : 0; // Placeholder

  return {
    vault: vaultData,
    isLoading,
    deposit,
    withdraw,
    calculateShareValue,
    estimatedAPY,
  };
}
