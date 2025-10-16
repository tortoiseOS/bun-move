/**
 * Component for displaying vault information
 */

import { useVault } from "@bun-move/hooks";
import { Card, Flex, Text, Heading, Badge, Skeleton, Progress } from "@radix-ui/themes";

export interface VaultCardProps {
  vaultId: string;
  name: string;
}

export function VaultCard({ vaultId, name }: VaultCardProps) {
  const { vault, isLoading, estimatedAPY } = useVault(vaultId);

  if (isLoading) {
    return (
      <Card>
        <Skeleton width="100%" height="250px" />
      </Card>
    );
  }

  if (!vault) {
    return (
      <Card>
        <Text color="gray">Vault not found</Text>
      </Card>
    );
  }

  const utilizationRate =
    vault.totalShares > 0
      ? Number((vault.totalBalance * BigInt(100)) / vault.totalShares)
      : 0;

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="5">{name}</Heading>
          <Badge color="green" size="2">
            {estimatedAPY.toFixed(2)}% APY
          </Badge>
        </Flex>

        <Flex direction="column" gap="3">
          <Flex justify="between">
            <Text color="gray">Total Deposited</Text>
            <Text weight="bold">{vault.totalBalance.toString()}</Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">Total Shares</Text>
            <Text weight="bold">{vault.totalShares.toString()}</Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">Active Strategy</Text>
            <Badge color="blue">Strategy #{vault.activeStrategyId}</Badge>
          </Flex>

          <Flex direction="column" gap="2">
            <Flex justify="between">
              <Text color="gray">Utilization</Text>
              <Text weight="bold">{utilizationRate}%</Text>
            </Flex>
            <Progress value={utilizationRate} max={100} />
          </Flex>

          <Flex justify="between">
            <Text color="gray" size="1">
              Last Compound
            </Text>
            <Text size="1">
              {new Date(vault.lastCompound * 1000).toLocaleString()}
            </Text>
          </Flex>
        </Flex>

        <Badge color="purple" variant="soft">
          🧠 RL-Optimized Yields
        </Badge>
      </Flex>
    </Card>
  );
}
