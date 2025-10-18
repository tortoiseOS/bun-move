# @tortoise-os/sdk 🐢🔧

> TypeScript SDK for TortoiseOS smart contracts - Interact with the full DeFi suite on Sui

## 📦 Installation

```bash
# bun (recommended)
bun add @tortoise-os/sdk

# npm
npm install @tortoise-os/sdk
```

## 🚀 Quick Start

```typescript
import { TortoiseSDK } from '@tortoise-os/sdk';

// Initialize SDK
const sdk = new TortoiseSDK({
  network: 'devnet', // or 'testnet', 'mainnet', 'localnet'
});

// Access DeFi protocols
const swapPool = await sdk.swap.getPool('SUI/USDC');
const vault = await sdk.vault.getVault('TortoiseVault-SUI');
const stablecoin = await sdk.stablecoin.getMintInfo('TortoiseUSD');
```

## 🎯 Features

### 🔄 TortoiseSwap (AMM)
AI-powered automated market maker:

```typescript
// Get pool information
const pool = await sdk.swap.getPool('SUI/USDC');
console.log(pool.reserves, pool.fee, pool.volume24h);

// Calculate swap output
const output = await sdk.swap.calculateSwap({
  poolId: 'SUI/USDC',
  amountIn: '1000000000', // 1 SUI
  tokenIn: 'SUI',
});

// Execute swap (requires wallet connection)
const tx = await sdk.swap.swap({
  poolId: 'SUI/USDC',
  amountIn: '1000000000',
  tokenIn: 'SUI',
  minAmountOut: output.amountOut * 0.99, // 1% slippage
});
```

### 💰 TortoiseVault (Yield Aggregator)
Auto-compounding yield strategies:

```typescript
// Get vault info
const vault = await sdk.vault.getVault('TortoiseVault-SUI');
console.log(vault.apy, vault.tvl, vault.strategy);

// Deposit into vault
const depositTx = await sdk.vault.deposit({
  vaultId: 'TortoiseVault-SUI',
  amount: '1000000000', // 1 SUI
});

// Withdraw from vault
const withdrawTx = await sdk.vault.withdraw({
  vaultId: 'TortoiseVault-SUI',
  shares: '500000000',
});
```

### 💵 TortoiseUSD (Stablecoin)
NFT-collateralized stablecoin:

```typescript
// Get stablecoin metrics
const info = await sdk.stablecoin.getMintInfo();
console.log(info.totalSupply, info.collateralRatio);

// Mint TortoiseUSD with NFT collateral
const mintTx = await sdk.stablecoin.mint({
  nftId: '0x...',
  amount: '100000000', // 100 TortoiseUSD
});

// Redeem collateral
const redeemTx = await sdk.stablecoin.redeem({
  amount: '100000000',
});
```

## 📚 Full Protocol Suite

| Protocol | Description | Methods |
|----------|-------------|---------|
| **TortoiseSwap** | AI-powered AMM | `getPool`, `swap`, `addLiquidity`, `removeLiquidity` |
| **TortoiseVault** | Yield aggregator | `getVault`, `deposit`, `withdraw`, `harvest` |
| **TortoiseUSD** | NFT stablecoin | `mint`, `redeem`, `getCollateral` |
| **TortoiseOrderbook** | CLOB exchange | `placeOrder`, `cancelOrder`, `getOrders` |
| **TortoisePrediction** | Prediction markets | `createMarket`, `placeBet`, `resolve` |
| **TortoiseBridgeX** | Cross-chain bridge | `bridge`, `getRoute` |
| **TortoisePrivacy** | Private vaults | `deposit`, `withdraw` |
| **TortoiseRWA** | Real-world assets | `tokenize`, `redeem` |
| **TortoiseBTCfi** | Bitcoin DeFi | `stake`, `unstake` |
| **TortoiseArb** | MEV arbitrage | `findOpportunity`, `execute` |

## 🔧 Advanced Usage

### Custom Network Configuration

```typescript
const sdk = new TortoiseSDK({
  network: 'custom',
  rpcUrl: 'https://your-sui-node.example.com',
  packageIds: {
    swap: '0x...',
    vault: '0x...',
    // ... other package IDs
  },
});
```

### Transaction Building

```typescript
// Build transactions without executing
const txBlock = sdk.swap.buildSwapTransaction({
  poolId: 'SUI/USDC',
  amountIn: '1000000000',
  tokenIn: 'SUI',
  minAmountOut: '50000000',
});

// Sign and execute later
const result = await suiClient.signAndExecuteTransactionBlock({
  transactionBlock: txBlock,
  signer: keypair,
});
```

### Event Listening

```typescript
// Listen to swap events
sdk.swap.onSwap((event) => {
  console.log('Swap executed:', event.amountIn, event.amountOut);
});

// Listen to vault deposit events
sdk.vault.onDeposit((event) => {
  console.log('Vault deposit:', event.user, event.amount);
});
```

## 🏗️ Integration with React

Works seamlessly with `@tortoise-os/hooks`:

```typescript
import { useTortoiseContract } from '@tortoise-os/hooks';
import { sdk } from '@tortoise-os/sdk';

function SwapComponent() {
  const { write } = useTortoiseContract('swap');

  const handleSwap = async () => {
    const output = await sdk.swap.calculateSwap({...});
    await write.swap({...});
  };

  return <button onClick={handleSwap}>Swap</button>;
}
```

## 📖 API Documentation

Full API documentation available at:
- [TortoiseOS Docs](https://github.com/tortoise-os/bun-move)
- [API Reference](https://github.com/tortoise-os/bun-move/tree/main/packages/sdk/docs)

## 🧪 Testing

```bash
# Run SDK tests
bun test

# Test against local Sui network
bun test:local

# Test with mock contracts
bun test:mock
```

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## 📄 License

MIT © TortoiseOS Team

## 🔗 Links

- [TortoiseOS](https://github.com/tortoise-os/bun-move)
- [Sui Documentation](https://docs.sui.io)
- [Report Issues](https://github.com/tortoise-os/bun-move/issues)

---

**Built for Sui, powered by Bun** 🐢⚡
