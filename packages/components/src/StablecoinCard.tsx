/**
 * Component for displaying stablecoin vault information
 */

import { useStablecoin } from "@bun-move/hooks";
import {
  Card,
  Flex,
  Text,
  Heading,
  Badge,
  Skeleton,
  Progress,
} from "@radix-ui/themes";

export interface StablecoinCardProps {
  vaultId: string;
}

export function StablecoinCard({ vaultId }: StablecoinCardProps) {
  const { vault, isLoading, collateralizationRatio, isHealthy } =
    useStablecoin(vaultId);

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

  const healthColor = isHealthy ? "green" : "red";
  const minRatio = vault.minRatioBps / 100;

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="5">NFT Collateral Vault</Heading>
          <Badge color={healthColor}>
            {isHealthy ? "✅ Healthy" : "⚠️ At Risk"}
          </Badge>
        </Flex>

        <Flex direction="column" gap="3">
          <Flex justify="between">
            <Text color="gray">Collateral Value</Text>
            <Text weight="bold">
              ${(Number(vault.assessedValueUsd) / 1_000_000).toFixed(2)}
            </Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">TUSD Debt</Text>
            <Text weight="bold">
              ${(Number(vault.debt) / 1_000_000).toFixed(2)}
            </Text>
          </Flex>

          <Flex justify="between">
            <Text color="gray">NFTs Deposited</Text>
            <Badge color="blue">{vault.nftIds.length} NFTs</Badge>
          </Flex>

          <Flex direction="column" gap="2">
            <Flex justify="between">
              <Text color="gray">Collateralization Ratio</Text>
              <Text weight="bold" color={healthColor}>
                {collateralizationRatio.toFixed(2)}%
              </Text>
            </Flex>
            <Progress
              value={collateralizationRatio}
              max={200}
              color={healthColor}
            />
            <Text size="1" color="gray">
              Minimum: {minRatio}%
            </Text>
          </Flex>
        </Flex>

        <Badge color="cyan" variant="soft">
          🎨 AI NFT Valuation
        </Badge>
      </Flex>
    </Card>
  );
}
