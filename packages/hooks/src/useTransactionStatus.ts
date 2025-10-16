/**
 * Hook for tracking transaction status
 */

import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";

export function useTransactionStatus(digest?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["transaction-status", digest],
    queryFn: async () => {
      if (!digest) {
        throw new Error("No transaction digest provided");
      }

      const tx = await client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
      });

      const status = tx.effects?.status?.status;
      const isSuccess = status === "success";
      const error = tx.effects?.status?.error;

      return {
        digest,
        status,
        isSuccess,
        error,
        effects: tx.effects,
        events: tx.events,
        objectChanges: tx.objectChanges,
        balanceChanges: tx.balanceChanges,
        timestamp: tx.timestampMs,
      };
    },
    enabled: !!digest,
    retry: (failureCount, error: any) => {
      // Retry if transaction not found yet (might be pending)
      if (error.message?.includes("not found")) {
        return failureCount < 10;
      }
      return false;
    },
    retryDelay: 1000,
  });
}

/**
 * Hook to wait for transaction confirmation
 */
export function useWaitForTransaction(
  digest?: string,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
) {
  const result = useTransactionStatus(digest);

  // Trigger callbacks when status changes
  if (result.data?.isSuccess && onSuccess) {
    onSuccess(result.data);
  } else if (result.data?.error && onError) {
    onError(new Error(result.data.error));
  }

  return result;
}
