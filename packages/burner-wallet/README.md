# @bun-move/burner-wallet

Burner wallet for Sui dApp local development. Auto-creates and persists wallets for testing.

## Features

- Auto-generates Ed25519 keypair
- Persists in localStorage
- Auto-requests funds from local faucet
- Perfect for development/testing

## Installation

```bash
bun add @bun-move/burner-wallet
```

## Usage

### Basic Usage

```typescript
import { createBurnerWallet } from "@bun-move/burner-wallet";

const wallet = createBurnerWallet();

console.log("Address:", wallet.getAddress());

// Request funds from local faucet
await wallet.requestFunds();
```

### Singleton Pattern

```typescript
import { getBurnerWallet } from "@bun-move/burner-wallet";

// Always returns same instance
const wallet = getBurnerWallet();
```

### Configuration

```typescript
const wallet = createBurnerWallet({
  persist: true,                              // Save to localStorage
  autoFund: true,                             // Auto-request from faucet
  faucetUrl: "http://localhost:9123/gas",     // Faucet endpoint
});
```

### With Sui dApp Kit

```typescript
import { getBurnerWallet } from "@bun-move/burner-wallet";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";

const wallet = getBurnerWallet();
const client = new SuiClient({ url: "http://localhost:9000" });

// Sign transaction
const tx = new TransactionBlock();
// ... build transaction

const signature = await wallet.getKeypair().signTransactionBlock(
  await tx.build({ client })
);
```

### Clear Wallet

```typescript
wallet.clear(); // Removes from localStorage
```

## API

### `createBurnerWallet(config?)`

Creates new burner wallet instance.

### `getBurnerWallet(config?)`

Gets singleton burner wallet instance.

### `BurnerWallet`

#### Methods

- `getAddress(): string` - Get Sui address
- `getKeypair(): Ed25519Keypair` - Get keypair for signing
- `requestFunds(): Promise<boolean>` - Request from faucet
- `clear(): void` - Clear from storage

#### Static Methods

- `BurnerWallet.isBurnerWalletSupported(): boolean` - Check if localStorage available

## Development Workflow

1. Start local Sui network with faucet
2. Create burner wallet - auto-funded
3. Develop and test
4. Wallet persists across refreshes

## Security

**⚠️ FOR DEVELOPMENT ONLY**

- Never use in production
- Never send real funds
- Keys stored in localStorage (not secure)
- Auto-clears on browser data clear

## Example: React Hook

```typescript
import { useEffect, useState } from "react";
import { getBurnerWallet } from "@bun-move/burner-wallet";

export function useBurnerWallet() {
  const [wallet, setWallet] = useState<ReturnType<typeof getBurnerWallet>>();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const w = getBurnerWallet();
      w.requestFunds(); // Auto-fund on mount
      setWallet(w);
    }
  }, []);

  return wallet;
}
```

## License

MIT
