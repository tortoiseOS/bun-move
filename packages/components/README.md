# @bun-move/components

Beautiful, reusable UI components for Sui dApps built with Radix UI.

## Installation

```bash
bun add @bun-move/components
```

## Core Components

### Address

Display Sui addresses with formatting, copy, and explorer link.

```typescript
import { Address } from "@bun-move/components";

<Address
  address="0xabc123..."
  format="short"       // or "long"
  showCopy={true}
  showExplorer={true}
  label="Wallet"
/>
```

### Balance

Display token balances with auto-refresh.

```typescript
import { Balance, MultiBalance } from "@bun-move/components";

// Single balance
<Balance
  address="0xabc..."
  coinType="0x2::sui::SUI"
  label="SUI Balance"
  watch={true}
/>

// Multiple balances
<MultiBalance
  address="0xabc..."
  coinTypes={[
    { type: "0x2::sui::SUI", label: "SUI" },
    { type: "0xabc::tusd::TUSD", label: "TUSD" },
  ]}
/>
```

### NetworkBadge

Display current network status.

```typescript
import { NetworkBadge } from "@bun-move/components";

<NetworkBadge network="localnet" />
// Colors: localnet=gray, devnet=blue, testnet=orange, mainnet=green
```

### TransactionButton

Button with loading states for transactions.

```typescript
import { TransactionButton } from "@bun-move/components";

<TransactionButton
  onClick={handleSwap}
  isLoading={swap.isLoading}
  isDisabled={!isReady}
  color="green"
  size="3"
>
  Swap Tokens
</TransactionButton>
```

### ObjectDisplay

Display Sui objects with all details.

```typescript
import { ObjectDisplay } from "@bun-move/components";

<ObjectDisplay objectId="0xabc123..." />
```

## DeFi Components

### PoolCard

Display AMM pool information.

```typescript
import { PoolCard } from "@bun-move/components";

<PoolCard
  poolId="0xabc..."
  coinASymbol="SUI"
  coinBSymbol="USDC"
/>
```

Features:
- Reserve amounts
- LP supply
- Fee rate (AI-optimized badge)
- TVL calculation

### VaultCard

Display yield vault information.

```typescript
import { VaultCard } from "@bun-move/components";

<VaultCard
  vaultId="0xabc..."
  name="SUI Vault"
/>
```

Features:
- APY display
- Total deposited
- Active strategy
- Utilization rate
- Last compound timestamp
- RL-optimized badge

### StablecoinCard

Display NFT collateral vault.

```typescript
import { StablecoinCard } from "@bun-move/components";

<StablecoinCard vaultId="0xabc..." />
```

Features:
- Collateral value
- Debt amount
- NFT count
- Collateralization ratio with progress bar
- Health status
- AI valuation badge

## Wallet Components

### WalletButton

Enhanced wallet connection button.

```typescript
import { WalletButton, CustomWalletButton } from "@bun-move/components";

// Default dApp Kit button
<WalletButton />

// Custom styled button
<CustomWalletButton
  onConnect={() => console.log("Connected")}
  onDisconnect={() => console.log("Disconnected")}
/>
```

### AccountInfo

Complete account information panel.

```typescript
import { AccountInfo } from "@bun-move/components";

<AccountInfo />
```

Shows:
- Address with copy/explorer
- SUI balance
- Object count

## Utility Components

### CopyButton

Copy text to clipboard.

```typescript
import { CopyButton } from "@bun-move/components";

<CopyButton text="0xabc123..." />
```

### ExplorerLink

Link to Sui Explorer.

```typescript
import { ExplorerLink } from "@bun-move/components";

<ExplorerLink address="0xabc..." />
<ExplorerLink objectId="0xdef..." />
<ExplorerLink txDigest="abc123..." network="devnet" />
```

### LoadingSpinner

Loading state indicator.

```typescript
import { LoadingSpinner } from "@bun-move/components";

<LoadingSpinner message="Loading pools..." size="3" />
```

## Styling

All components use Radix UI Themes. Configure your theme:

```typescript
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

<Theme appearance="dark" accentColor="blue">
  <App />
</Theme>
```

## Complete Example

```typescript
import {
  PoolCard,
  VaultCard,
  WalletButton,
  AccountInfo,
  NetworkBadge,
} from "@bun-move/components";
import { Flex, Container } from "@radix-ui/themes";

function Dashboard() {
  return (
    <Container size="4">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <NetworkBadge network="localnet" />
          <WalletButton />
        </Flex>

        {/* Account */}
        <AccountInfo />

        {/* Pools */}
        <Flex gap="4" wrap="wrap">
          <PoolCard
            poolId="0x123..."
            coinASymbol="SUI"
            coinBSymbol="USDC"
          />
          <VaultCard
            vaultId="0x456..."
            name="SUI Vault"
          />
        </Flex>
      </Flex>
    </Container>
  );
}
```

## TypeScript

All components are fully typed:

```typescript
import type {
  AddressProps,
  BalanceProps,
  PoolCardProps,
  VaultCardProps,
} from "@bun-move/components";
```

## Customization

Components accept Radix UI props for styling:

```typescript
<Address
  address="0xabc..."
  style={{ padding: "10px" }}
  className="my-custom-class"
/>
```

## Best Practices

1. **Use watch for real-time data**
   ```typescript
   <Balance watch={true} />
   ```

2. **Provide loading states**
   ```typescript
   {isLoading ? <LoadingSpinner /> : <PoolCard />}
   ```

3. **Handle errors gracefully**
   ```typescript
   {error ? <ErrorCard error={error} /> : <Component />}
   ```

4. **Keep cards responsive**
   ```typescript
   <Flex gap="4" wrap="wrap">
     {pools.map(pool => <PoolCard key={pool.id} />)}
   </Flex>
   ```

## License

MIT
