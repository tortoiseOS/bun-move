/**
 * Hook for TortoiseUSD stablecoin interactions
 */

import { useTortoiseRead, useTortoiseWrite } from "./index";

export interface CollateralVault {
  id: string;
  nftIds: string[];
  assessedValueUsd: bigint;
  debt: bigint;
  minRatioBps: number;
}

export function useStablecoin(vaultId?: string) {
  // Read vault state
  const { data: vaultData, isLoading } = useTortoiseRead<CollateralVault>({
    contractName: "stablecoin",
    module: "nft_collateral",
    functionName: "get_vault",
    args: vaultId ? [vaultId] : undefined,
    enabled: !!vaultId,
    watch: true,
  });

  // Write operations
  const depositNFT = useTortoiseWrite({
    contractName: "stablecoin",
    module: "nft_collateral",
    functionName: "deposit_nft_mint",
  });

  const repay = useTortoiseWrite({
    contractName: "stablecoin",
    module: "nft_collateral",
    functionName: "repay_withdraw",
  });

  // Calculate collateralization ratio
  const collateralizationRatio = vaultData
    ? Number((vaultData.assessedValueUsd * BigInt(10000)) / vaultData.debt) / 100
    : 0;

  const isHealthy =
    vaultData && collateralizationRatio >= vaultData.minRatioBps / 100;

  const maxMintable = vaultData
    ? (vaultData.assessedValueUsd * BigInt(10000)) / BigInt(vaultData.minRatioBps)
    : BigInt(0);

  return {
    vault: vaultData,
    isLoading,
    depositNFT,
    repay,
    collateralizationRatio,
    isHealthy,
    maxMintable,
  };
}
