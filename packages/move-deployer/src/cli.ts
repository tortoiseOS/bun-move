#!/usr/bin/env bun

/**
 * CLI for generating TypeScript types from deployed Move contracts
 * Similar to bun-eth's foundry-deployer
 */

import { generateDeployedContracts } from "./generator";
import { createLogger } from "@bun-move/core";

const logger = createLogger("move-deployer");

async function main() {
  try {
    logger.info("🔧 Generating deployed contracts...");

    const cwd = process.cwd();

    await generateDeployedContracts({
      moveRoot: `${cwd}/packages/move`,
      outputPath: `${cwd}/packages/move/deployedContracts.ts`,
      networks: {
        localnet: { name: "localnet", rpcUrl: "http://localhost:9000" },
        devnet: { name: "devnet", rpcUrl: "https://fullnode.devnet.sui.io" },
        testnet: { name: "testnet", rpcUrl: "https://fullnode.testnet.sui.io" },
        mainnet: { name: "mainnet", rpcUrl: "https://fullnode.mainnet.sui.io" },
      },
    });

    logger.info("✅ Deployed contracts generated successfully");
  } catch (error) {
    logger.error("Failed to generate deployed contracts:", error);
    process.exit(1);
  }
}

main();
