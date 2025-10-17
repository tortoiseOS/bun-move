/**
 * Hook for writing to Move contracts
 * Similar to wagmi's useWriteContract
 */

import { useState, useCallback } from "react";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useTortoiseContract } from "./useTortoiseContract";
import type { NetworkType } from "@bun-move/core";

export interface UseTortoiseWriteConfig {
  contractName: string;
  module: string;
  functionName: string;
  network?: NetworkType;
}

export interface ExecuteConfig {
  args?: any[];
  typeArgs?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export function useTortoiseWrite(config: UseTortoiseWriteConfig) {
  const client = useSuiClient();
  const contract = useTortoiseContract(config.contractName, config.network);
  const { mutate: signAndExecute, isPending } =
    useSignAndExecuteTransaction();

  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (executeConfig: ExecuteConfig) => {
      if (!contract) {
        const err = new Error(
          `Contract "${config.contractName}" not deployed on this network`
        );
        setError(err);
        executeConfig.onError?.(err);
        return;
      }

      try {
        setError(null);
        const tx = new Transaction();

        const target = contract.buildTarget(config.module, config.functionName);

        tx.moveCall({
          target,
          arguments: executeConfig.args || [],
          typeArguments: executeConfig.typeArgs || [],
        });

        signAndExecute(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              setIsConfirming(true);
              try {
                // Wait for transaction to be confirmed
                await client.waitForTransaction({
                  digest: result.digest,
                });
                setIsConfirming(false);
                executeConfig.onSuccess?.(result);
              } catch (err: any) {
                setIsConfirming(false);
                setError(err);
                executeConfig.onError?.(err);
              }
            },
            onError: (err: any) => {
              setError(err);
              executeConfig.onError?.(err);
            },
          }
        );
      } catch (err: any) {
        setError(err);
        executeConfig.onError?.(err);
      }
    },
    [contract, config, signAndExecute, client]
  );

  return {
    execute,
    isPending,
    isConfirming,
    isLoading: isPending || isConfirming,
    error,
  };
}

/**
 * Simplified write hook with direct execution
 */
export function useContractWrite(
  contractName: string,
  module: string,
  functionName: string
) {
  return useTortoiseWrite({
    contractName,
    module,
    functionName,
  });
}
