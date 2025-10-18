# @tortoise-os/hooks

React hooks for Sui blockchain interactions, specifically designed for TortoiseOS dApps.

## Installation

```bash
bun add @tortoise-os/hooks
```

## Core Hooks

### useDeployedContract

Get information about deployed contracts.

```typescript
import { useDeployedContract } from "@tortoise-os/hooks";

function MyComponent() {
  const contract = useDeployedContract("amm", "localnet");

  console.log(contract?.packageId); // 0xabc...
  console.log(contract?.modules);   // ["pool", "router"]
}
```

### useTortoiseRead

Read data from Move contracts (view functions).

```typescript
import { useTortoiseRead } from "@tortoise-os/hooks";

function PoolInfo({ poolId }) {
  const { data, isLoading } = useTortoiseRead({
    contractName: "amm",
    module: "pool",
    functionName: "get_reserves",
    args: [poolId],
    watch: true, // Auto-refresh every 4s
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      Reserve A: {data.reserveA.toString()}
      Reserve B: {data.reserveB.toString()}
    </div>
  );
}
```

### useTortoiseWrite

Write to Move contracts (transactions).

```typescript
import { useTortoiseWrite } from "@tortoise-os/hooks";

function SwapButton() {
  const { execute, isLoading, error } = useTortoiseWrite({
    contractName: "amm",
    module: "pool",
    functionName: "swap_a_to_b",
  });

  const handleSwap = () => {
    execute({
      args: [poolId, amountIn],
      typeArgs: [coinTypeA, coinTypeB],
      onSuccess: (result) => {
        console.log("Swap successful:", result.digest);
      },
      onError: (error) => {
        console.error("Swap failed:", error);
      },
    });
  };

  return (
    <button onClick={handleSwap} disabled={isLoading}>
      {isLoading ? "Swapping..." : "Swap"}
    </button>
  );
}
```

### useTortoiseEvent

Watch for contract events.

```typescript
import { useTortoiseEvent } from "@tortoise-os/hooks";

function SwapEvents() {
  const { events, isLoading } = useTortoiseEvent({
    contractName: "amm",
    module: "pool",
    eventType: "SwapExecuted",
    onEvent: (event) => {
      console.log("New swap:", event);
    },
  });

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          Swap: {event.parsedJson.amountIn} → {event.parsedJson.amountOut}
        </div>
      ))}
    </div>
  );
}
```

## Utility Hooks

### useBalance

Get SUI or custom coin balance.

```typescript
import { useBalance, useSuiBalance } from "@tortoise-os/hooks";

function WalletBalance() {
  const { data: sui } = useSuiBalance();
  const { data: tusd } = useBalance({
    coinType: "0xabc::tusd::TUSD",
    watch: true,
  });

  return (
    <div>
      SUI: {sui?.formatted}
      TUSD: {tusd?.formatted}
    </div>
  );
}
```

### useObjectOwned

Get objects owned by an address.

```typescript
import { useObjectOwned } from "@tortoise-os/hooks";

function MyNFTs() {
  const { data: objects, isLoading } = useObjectOwned({
    filter: {
      StructType: "0xabc::nft::NFT",
    },
  });

  return (
    <div>
      {objects?.map((obj) => (
        <div key={obj.data.objectId}>
          NFT: {obj.data.objectId}
        </div>
      ))}
    </div>
  );
}
```

### useTransactionStatus

Track transaction status.

```typescript
import { useTransactionStatus } from "@tortoise-os/hooks";

function TransactionTracker({ digest }) {
  const { data, isLoading } = useTransactionStatus(digest);

  if (isLoading) return <div>Confirming...</div>;
  if (data?.isSuccess) return <div>Success!</div>;
  if (data?.error) return <div>Error: {data.error}</div>;

  return null;
}
```

## DeFi-Specific Hooks

### usePool

Interact with AMM pools.

```typescript
import { usePool } from "@tortoise-os/hooks";

function PoolInterface({ poolId }) {
  const {
    pool,
    swap,
    addLiquidity,
    calculateSwapOutput,
  } = usePool(poolId);

  const handleSwap = () => {
    const amountOut = calculateSwapOutput(amountIn, true);

    swap.execute({
      args: [poolId, amountIn, amountOut],
      typeArgs: [coinTypeA, coinTypeB],
    });
  };

  return (
    <div>
      <div>Fee: {pool?.feeBps / 100}%</div>
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
}
```

### useVault

Interact with yield vaults.

```typescript
import { useVault } from "@tortoise-os/hooks";

function VaultInterface({ vaultId }) {
  const {
    vault,
    deposit,
    withdraw,
    estimatedAPY,
    calculateShareValue,
  } = useVault(vaultId);

  return (
    <div>
      <div>APY: {estimatedAPY}%</div>
      <div>TVL: {vault?.totalBalance.toString()}</div>
      <button onClick={() => deposit.execute({ args: [amount] })}>
        Deposit
      </button>
    </div>
  );
}
```

### useStablecoin

Interact with NFT-backed stablecoin.

```typescript
import { useStablecoin } from "@tortoise-os/hooks";

function CollateralVault({ vaultId }) {
  const {
    vault,
    collateralizationRatio,
    isHealthy,
    depositNFT,
    repay,
  } = useStablecoin(vaultId);

  return (
    <div>
      <div>Collateral Ratio: {collateralizationRatio}%</div>
      <div>Health: {isHealthy ? "✅" : "⚠️"}</div>
      <button onClick={() => depositNFT.execute({ args: [nftId] })}>
        Deposit NFT
      </button>
    </div>
  );
}
```

## Best Practices

1. **Use `watch: true` for real-time data**
   ```typescript
   useTortoiseRead({ ..., watch: true })
   ```

2. **Handle loading and error states**
   ```typescript
   const { data, isLoading, error } = useTortoiseRead(...);
   if (isLoading) return <Loading />;
   if (error) return <Error error={error} />;
   ```

3. **Provide user feedback for transactions**
   ```typescript
   const { execute, isLoading } = useTortoiseWrite(...);
   <button disabled={isLoading}>
     {isLoading ? "Processing..." : "Submit"}
   </button>
   ```

4. **Clean up subscriptions**
   - All hooks automatically clean up when component unmounts

## TypeScript

All hooks are fully typed. Import types:

```typescript
import type {
  Pool,
  Vault,
  CollateralVault,
  UseTortoiseReadConfig,
  UseTortoiseWriteConfig,
} from "@tortoise-os/hooks";
```

## License

MIT
