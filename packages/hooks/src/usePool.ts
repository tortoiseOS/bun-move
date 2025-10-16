/**
 * DeFi-specific hook for AMM pools
 */

import { useTortoiseRead, useTortoiseWrite } from "./index";

export interface Pool {
  id: string;
  coinA: string;
  coinB: string;
  reserveA: bigint;
  reserveB: bigint;
  lpSupply: bigint;
  feeBps: number;
}

export function usePool(poolId: string) {
  // Read pool state
  const { data: poolData, isLoading } = useTortoiseRead<Pool>({
    contractName: "amm",
    module: "pool",
    functionName: "get_pool",
    args: [poolId],
    watch: true,
  });

  // Write operations
  const swap = useTortoiseWrite({
    contractName: "amm",
    module: "pool",
    functionName: "swap_a_to_b",
  });

  const addLiquidity = useTortoiseWrite({
    contractName: "amm",
    module: "pool",
    functionName: "add_liquidity",
  });

  const removeLiquidity = useTortoiseWrite({
    contractName: "amm",
    module: "pool",
    functionName: "remove_liquidity",
  });

  // Helper to calculate output amount
  const calculateSwapOutput = (amountIn: bigint, isAtoB: boolean) => {
    if (!poolData) return null;

    const [reserveIn, reserveOut] = isAtoB
      ? [poolData.reserveA, poolData.reserveB]
      : [poolData.reserveB, poolData.reserveA];

    // x * y = k formula with fees
    const amountInWithFee = amountIn * BigInt(10000 - poolData.feeBps);
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * BigInt(10000) + amountInWithFee;

    return numerator / denominator;
  };

  return {
    pool: poolData,
    isLoading,
    swap,
    addLiquidity,
    removeLiquidity,
    calculateSwapOutput,
  };
}
