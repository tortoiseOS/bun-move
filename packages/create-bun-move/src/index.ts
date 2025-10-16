#!/usr/bin/env bun

/**
 * create-bun-move
 * Scaffolding CLI for TortoiseOS dApps
 * Based on bun-eth's create-bun-eth pattern
 */

import { parseArgs } from "util";
import { join } from "path";
import { $ } from "bun";
import degit from "degit";

interface CliArgs {
  projectName?: string;
  type?: ProjectType;
  products?: string[];
}

type ProjectType = "full-stack" | "backend-only" | "move-only";

const TORTOISE_PRODUCTS = [
  { id: "amm", name: "TortoiseSwap (AMM)", phase: 1 },
  { id: "vault", name: "TortoiseVault (Auto-Compounder)", phase: 1 },
  { id: "stablecoin", name: "TortoiseUSD (NFT Stablecoin)", phase: 2 },
  { id: "arb", name: "TortoiseArb (Arbitrage Bot)", phase: 2 },
  { id: "bridge", name: "TortoiseBridgeX (Cross-Chain)", phase: 3 },
  { id: "rwa", name: "RWA Vault", phase: 3 },
  { id: "btcfi", name: "BTCfi Aggregator", phase: 3 },
  { id: "privacy", name: "Privacy Vault", phase: 4 },
  { id: "prediction", name: "Prediction Market", phase: 4 },
  { id: "orderbook", name: "Orderbook Launcher", phase: 4 },
];

async function main() {
  console.log("🐢 TortoiseOS dApp Scaffolder\n");

  // Parse CLI args
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      type: { type: "string", short: "t" },
      products: { type: "string", short: "p", multiple: true },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  const projectName = positionals[0] || (await promptProjectName());
  const projectType =
    (values.type as ProjectType) || (await promptProjectType());
  const products =
    values.products || (projectType === "move-only" ? await promptProducts() : []);

  await scaffoldProject(projectName, projectType, products);
}

async function promptProjectName(): Promise<string> {
  console.log("📝 Project name:");
  const name = prompt("  Enter name (e.g., my-tortoise-dapp): ");
  if (!name) {
    console.error("❌ Project name is required");
    process.exit(1);
  }
  return name;
}

async function promptProjectType(): Promise<ProjectType> {
  console.log("\n📦 Select project type:\n");
  console.log("  1) Full-Stack (API + Web + Move contracts)");
  console.log("  2) Backend-Only (API + Move contracts)");
  console.log("  3) Move-Only (Smart contracts only)\n");

  const choice = prompt("  Choose (1-3): ");

  switch (choice) {
    case "1":
      return "full-stack";
    case "2":
      return "backend-only";
    case "3":
      return "move-only";
    default:
      console.error("❌ Invalid choice");
      process.exit(1);
  }
}

async function promptProducts(): Promise<string[]> {
  console.log("\n🎯 Select TortoiseOS products to include:\n");
  console.log("  0) All products (full TortoiseOS suite)");

  TORTOISE_PRODUCTS.forEach((p, i) => {
    console.log(`  ${i + 1}) ${p.name} (Phase ${p.phase})`);
  });

  console.log();
  const choices = prompt("  Choose (0-10, comma-separated): ");

  if (choices === "0") {
    return TORTOISE_PRODUCTS.map((p) => p.id);
  }

  const indices = choices!.split(",").map((s) => parseInt(s.trim()) - 1);
  return indices
    .filter((i) => i >= 0 && i < TORTOISE_PRODUCTS.length)
    .map((i) => TORTOISE_PRODUCTS[i].id);
}

async function scaffoldProject(
  name: string,
  type: ProjectType,
  products: string[]
) {
  const targetDir = join(process.cwd(), name);

  console.log(`\n🚀 Creating ${type} project: ${name}\n`);

  // Clone template via degit (respects .gitattributes)
  console.log("📥 Downloading template...");
  const emitter = degit("your-github-org/bun-move", {
    cache: false,
    force: true,
  });

  try {
    await emitter.clone(targetDir);
  } catch (error) {
    console.error("❌ Failed to download template:", error);
    // For local development, copy from current directory
    console.log("📁 Using local template...");
    await $`cp -r ${process.cwd()} ${targetDir}`.quiet();
    await $`rm -rf ${targetDir}/node_modules ${targetDir}/.git`.quiet();
  }

  // Customize based on type
  if (type === "backend-only") {
    console.log("🗑️  Removing web frontend...");
    await $`rm -rf ${targetDir}/apps/web`.quiet();
    await updateWorkspaces(targetDir, ["apps/api", "packages/*"]);
    await updateDockerCompose(targetDir, false);
  } else if (type === "move-only") {
    console.log("🗑️  Keeping Move contracts only...");
    await $`rm -rf ${targetDir}/apps`.quiet();
    await updateWorkspaces(targetDir, ["packages/move/*"]);
  }

  // Filter Move packages if specific products selected
  if (products.length > 0 && products.length < TORTOISE_PRODUCTS.length) {
    console.log(`🎯 Keeping selected products: ${products.join(", ")}`);
    const allProducts = TORTOISE_PRODUCTS.map((p) => p.id);
    const toRemove = allProducts.filter((p) => !products.includes(p));

    for (const product of toRemove) {
      await $`rm -rf ${targetDir}/packages/move/${product}`.quiet();
    }
  }

  // Update package.json
  await updatePackageJson(targetDir, name);

  // Initialize git
  console.log("🔧 Initializing git repository...");
  await $`cd ${targetDir} && git init`.quiet();
  await $`cd ${targetDir} && git add .`.quiet();
  await $`cd ${targetDir} && git commit -m "feat: initialize TortoiseOS project"`.quiet();

  // Success message
  console.log("\n✅ Project created successfully!\n");
  console.log("📂 Next steps:\n");
  console.log(`  cd ${name}`);
  console.log(`  cp .env.example .env  # Configure environment`);
  console.log(`  task setup            # Install dependencies`);
  console.log(`  task dev:full         # Start development stack\n`);
  console.log("📚 Documentation: https://github.com/your-org/bun-move\n");
  console.log("🐢 Happy building with TortoiseOS!\n");
}

async function updateWorkspaces(targetDir: string, workspaces: string[]) {
  const pkgPath = join(targetDir, "package.json");
  const pkg = await Bun.file(pkgPath).json();
  pkg.workspaces = workspaces;
  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));
}

async function updatePackageJson(targetDir: string, name: string) {
  const pkgPath = join(targetDir, "package.json");
  const pkg = await Bun.file(pkgPath).json();
  pkg.name = name;
  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));
}

async function updateDockerCompose(targetDir: string, includeWeb: boolean) {
  const composePath = join(targetDir, "docker/docker-compose.yml");
  let compose = await Bun.file(composePath).text();

  if (!includeWeb) {
    // Remove web service section
    compose = compose.replace(/# TortoiseOS Web Frontend.*?networks:\s+- tortoise-net/s, "");
  }

  await Bun.write(composePath, compose);
}

function printHelp() {
  console.log(`
🐢 create-bun-move - TortoiseOS dApp Scaffolder

Usage:
  bunx create-bun-move [project-name] [options]

Options:
  -t, --type <type>         Project type (full-stack|backend-only|move-only)
  -p, --products <ids>      TortoiseOS products to include (comma-separated)
  -h, --help               Show this help

Examples:
  bunx create-bun-move my-dapp
  bunx create-bun-move my-dapp -t move-only -p amm,vault
  bunx create-bun-move my-dapp -t full-stack

TortoiseOS Products:
  amm         - TortoiseSwap (AMM with adaptive fees)
  vault       - TortoiseVault (Auto-compounder)
  stablecoin  - TortoiseUSD (NFT-backed stablecoin)
  arb         - TortoiseArb (Arbitrage bot)
  bridge      - TortoiseBridgeX (Cross-chain router)
  rwa         - RWA Vault (Real-world assets)
  btcfi       - BTCfi Aggregator (Bitcoin yield)
  privacy     - Privacy Vault (Encrypted yields)
  prediction  - Prediction Market (AI oracles)
  orderbook   - Orderbook Launcher (CLOB)
`);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
