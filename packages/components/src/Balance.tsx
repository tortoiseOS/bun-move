/**
 * Component for displaying token balances
 */

import { useBalance } from "@bun-move/hooks";
import { Flex, Text, Skeleton } from "@radix-ui/themes";

export interface BalanceProps {
  address?: string;
  coinType?: string;
  label?: string;
  watch?: boolean;
}

export function Balance({ address, coinType, label, watch }: BalanceProps) {
  const { data: balance, isLoading } = useBalance({ address, coinType, watch });

  if (isLoading) {
    return <Skeleton width="100px" height="24px" />;
  }

  if (!balance) {
    return <Text color="gray">-</Text>;
  }

  return (
    <Flex direction="column" gap="1">
      {label && (
        <Text size="1" color="gray">
          {label}
        </Text>
      )}
      <Flex align="baseline" gap="1">
        <Text size="4" weight="bold">
          {balance.formatted}
        </Text>
        <Text size="2" color="gray">
          {balance.symbol}
        </Text>
      </Flex>
    </Flex>
  );
}

/**
 * Component for displaying multiple balances
 */
export interface MultiBalanceProps {
  address?: string;
  coinTypes: Array<{ type: string; label: string }>;
}

export function MultiBalance({ address, coinTypes }: MultiBalanceProps) {
  return (
    <Flex direction="column" gap="3">
      {coinTypes.map((coin) => (
        <Balance
          key={coin.type}
          address={address}
          coinType={coin.type}
          label={coin.label}
          watch
        />
      ))}
    </Flex>
  );
}
