/**
 * Hook for fetching objects owned by an address
 */

import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";

export interface UseObjectOwnedConfig {
  address?: string;
  filter?: {
    StructType?: string;
    Package?: string;
    Module?: string;
  };
}

export function useObjectOwned(config: UseObjectOwnedConfig = {}) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const address = config.address || currentAccount?.address;

  return useQuery({
    queryKey: ["objects-owned", address, config.filter],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address provided");
      }

      const result = await client.getOwnedObjects({
        owner: address,
        filter: config.filter,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });

      return result.data;
    },
    enabled: !!address,
  });
}

/**
 * Hook to get a specific object by ID
 */
export function useObject(objectId?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["object", objectId],
    queryFn: async () => {
      if (!objectId) {
        throw new Error("No object ID provided");
      }

      return client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
          showPreviousTransaction: true,
        },
      });
    },
    enabled: !!objectId,
  });
}

/**
 * Hook to get dynamic fields of an object
 */
export function useDynamicFields(parentId?: string) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["dynamic-fields", parentId],
    queryFn: async () => {
      if (!parentId) {
        throw new Error("No parent ID provided");
      }

      const result = await client.getDynamicFields({
        parentId,
      });

      return result.data;
    },
    enabled: !!parentId,
  });
}
