/**
 * Component for displaying AMM pool information
 */

import { usePool } from "@bun-move/hooks";
import { Card, Flex, Text, Heading, Badge, Skeleton } from "@radix-ui/themes";

export interface PoolCardProps {
  poolId: string;
  coinASymbol: string;
  coinBSymbol: string;
}

export function PoolCard({ poolId, coinASymbol, coinBSymbol }: PoolCardProps) {
  const { pool, isLoading } = usePool(poolId);

  if (isLoading) {
    return (
      <Card>
        <Skeleton width="100%" height="200px" />
      </Card>
    );
  }

  if (!pool) {
    return (
      <Card>
        <Text color="gray">Pool not found</Text>
      </Card>
    );
  }

  const tvl = pool.reserveA + pool.reserveB; // Simplified

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="5">
            {coinASymbol} / {coinBSymbol}
          </Heading>
          <Badge color="blue">{pool.feeBps / 100}% Fee</Badge>
        </Flex>

        <Flex direction="column" gap="3">
          <Flex justify="between">
            <Text color="gray">Reserve {coinASymbol}</Text>
            <Text weight="bold">{pool.reserveA.toString()}</Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">Reserve {coinBSymbol}</Text>
            <Text weight="bold">{pool.reserveB.toString()}</Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">LP Supply</Text>
            <Text weight="bold">{pool.lpSupply.toString()}</Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">TVL</Text>
            <Text weight="bold">{tvl.toString()}</Text>
          </Flex>
        </Flex>

        <Badge color="green" variant="soft">
          🤖 AI-Optimized Fees
        </Badge>
      </Flex>
    </Card>
  );
}
