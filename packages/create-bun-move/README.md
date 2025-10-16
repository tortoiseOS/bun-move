# create-bun-move

Scaffolding tool for creating TortoiseOS dApps on Sui.

## Usage

```bash
# Interactive mode
bunx create-bun-move my-tortoise-dapp

# Full-stack mode
bunx create-bun-move my-dapp -t full-stack

# Backend-only mode
bunx create-bun-move my-dapp -t backend-only

# Move contracts only with specific products
bunx create-bun-move my-dapp -t move-only -p amm,vault
```

## Project Types

### Full-Stack
- **Includes**: API + Web + Move contracts
- **Use case**: Complete dApp with frontend
- **Stack**: Elysia API, Next.js frontend, Sui Move contracts

### Backend-Only
- **Includes**: API + Move contracts
- **Use case**: API-only service or bot
- **Stack**: Elysia API, Sui Move contracts

### Move-Only
- **Includes**: Move contracts only
- **Use case**: Pure smart contract development
- **Stack**: Sui Move contracts

## TortoiseOS Products

Select which TortoiseOS products to include:

| Product | Description | Phase |
|---------|-------------|-------|
| `amm` | TortoiseSwap - AI-powered AMM | 1 |
| `vault` | TortoiseVault - Auto-compounder | 1 |
| `stablecoin` | TortoiseUSD - NFT-backed stablecoin | 2 |
| `arb` | TortoiseArb - Arbitrage bot | 2 |
| `bridge` | TortoiseBridgeX - Cross-chain router | 3 |
| `rwa` | RWA Vault - Tokenized real-world assets | 3 |
| `btcfi` | BTCfi Aggregator - Bitcoin yield | 3 |
| `privacy` | Privacy Vault - Encrypted yields | 4 |
| `prediction` | Prediction Market - AI oracles | 4 |
| `orderbook` | Orderbook Launcher - CLOB | 4 |

## After Scaffolding

```bash
cd my-tortoise-dapp
cp .env.example .env      # Configure environment
task setup                # Install dependencies
task dev:full             # Start development stack
```

## Features

- **Bun-native**: No transpilation, fast execution
- **AI-ready**: Built-in Walrus + Nautilus TEE integration
- **Hot reload**: Move contracts auto-generate TypeScript types
- **Docker Compose**: Full local development stack
- **Task automation**: Comprehensive task runner

## License

MIT
