"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Heading, Flex, Text, Grid, Box, Section } from "@radix-ui/themes";
import {
  WalletButton,
  AccountInfo,
  NetworkBadge,
  PoolCard,
  VaultCard,
  StablecoinCard,
} from "@bun-move/components";

export default function Home() {
  const account = useCurrentAccount();

  return (
    <Container size="4" style={{ padding: "2rem" }}>
      <Flex direction="column" gap="8">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex direction="column" gap="2">
            <Heading size="8">🐢 TortoiseOS</Heading>
            <Text size="3" color="gray">
              AI-Native DeFi Operating System on Sui
            </Text>
          </Flex>
          <Flex gap="3" align="center">
            <NetworkBadge network="localnet" />
            <WalletButton />
          </Flex>
        </Flex>

        {/* Account Info */}
        {account && (
          <Section>
            <AccountInfo />
          </Section>
        )}

        {/* Products Overview */}
        <Section>
          <Flex direction="column" gap="4">
            <Heading size="6">TortoiseOS Products</Heading>
            <Text color="gray">
              10 AI-powered DeFi products on Sui. Connect your wallet to start.
            </Text>

            <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          </Flex>
        </Section>

        {/* Live Demos (if connected) */}
        {account && (
          <Section>
            <Flex direction="column" gap="4">
              <Heading size="6">Live Protocol Data</Heading>

              <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
                {/* Example Pool - will show "not found" until deployed */}
                <PoolCard
                  poolId="0x0"
                  coinASymbol="SUI"
                  coinBSymbol="USDC"
                />

                {/* Example Vault */}
                <VaultCard vaultId="0x0" name="SUI Vault" />

                {/* Example Stablecoin Vault */}
                <StablecoinCard vaultId="0x0" />
              </Grid>

              <Text size="2" color="gray">
                💡 Deploy contracts with <code>task deploy:localnet</code> to see live data
              </Text>
            </Flex>
          </Section>
        )}

        {/* Quick Start */}
        <Section>
          <Flex direction="column" gap="4">
            <Heading size="6">Quick Start</Heading>

            <Flex direction="column" gap="3">
              <QuickStartStep
                number="1"
                title="Start Local Sui Network"
                command="task dev:sui"
              />
              <QuickStartStep
                number="2"
                title="Deploy Contracts"
                command="task deploy:localnet"
              />
              <QuickStartStep
                number="3"
                title="Connect Wallet"
                description="Click the wallet button above to connect"
              />
              <QuickStartStep
                number="4"
                title="Interact with Protocols"
                description="Use the cards above to swap, deposit, and more"
              />
            </Flex>
          </Flex>
        </Section>
      </Flex>
    </Container>
  );
}

function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const phaseColors = {
    1: "blue",
    2: "cyan",
    3: "purple",
    4: "pink",
  } as const;

  return (
    <Box
      p="4"
      style={{
        border: "1px solid var(--gray-a6)",
        borderRadius: "8px",
        background: "var(--gray-a2)",
      }}
    >
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Text weight="bold" size="3">
            {product.name}
          </Text>
          <Text size="1" color={phaseColors[product.phase]}>
            Phase {product.phase}
          </Text>
        </Flex>
        <Text size="2" color="gray">
          {product.description}
        </Text>
        <Text size="1" color="blue">
          🤖 {product.ai}
        </Text>
      </Flex>
    </Box>
  );
}

function QuickStartStep({
  number,
  title,
  command,
  description,
}: {
  number: string;
  title: string;
  command?: string;
  description?: string;
}) {
  return (
    <Flex gap="3" align="start">
      <Box
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "var(--blue-9)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text size="1" weight="bold">
          {number}
        </Text>
      </Box>
      <Flex direction="column" gap="1">
        <Text weight="bold">{title}</Text>
        {command && (
          <Box
            p="2"
            style={{
              background: "var(--gray-a3)",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          >
            {command}
          </Box>
        )}
        {description && (
          <Text size="2" color="gray">
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

const PRODUCTS = [
  {
    id: "amm",
    name: "TortoiseSwap",
    description: "AI-powered AMM with adaptive fees",
    ai: "ML Volatility Model",
    phase: 1 as const,
  },
  {
    id: "vault",
    name: "TortoiseVault",
    description: "Auto-compounding yield optimizer",
    ai: "RL Optimizer in TEE",
    phase: 1 as const,
  },
  {
    id: "stablecoin",
    name: "TortoiseUSD",
    description: "NFT-backed stablecoin",
    ai: "Vision + NLP Valuation",
    phase: 2 as const,
  },
  {
    id: "arb",
    name: "TortoiseArb",
    description: "Arbitrage & MEV bot",
    ai: "GNN Signal Generator",
    phase: 2 as const,
  },
  {
    id: "bridge",
    name: "TortoiseBridgeX",
    description: "Cross-chain router",
    ai: "Multi-Agent LangChain",
    phase: 3 as const,
  },
  {
    id: "rwa",
    name: "RWA Vault",
    description: "Real-world asset tokenization",
    ai: "LLM Fraud Detection",
    phase: 3 as const,
  },
  {
    id: "btcfi",
    name: "BTCfi Aggregator",
    description: "Bitcoin yield on Sui",
    ai: "LSTM Correlation Forecast",
    phase: 3 as const,
  },
  {
    id: "privacy",
    name: "Privacy Vault",
    description: "Encrypted yields",
    ai: "Homomorphic Encryption",
    phase: 4 as const,
  },
  {
    id: "prediction",
    name: "Prediction Market",
    description: "AI-powered oracles",
    ai: "Ensemble AI Resolvers",
    phase: 4 as const,
  },
  {
    id: "orderbook",
    name: "Orderbook Launcher",
    description: "CLOB deployment",
    ai: "Prophet Liquidity Forecast",
    phase: 4 as const,
  },
];
