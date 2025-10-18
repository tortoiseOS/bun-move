# @tortoise-os/core 🐢⚙️

> Core utilities and types for TortoiseOS - The foundation of your Sui DeFi journey

## 📦 Installation

```bash
# bun (recommended)
bun add @tortoise-os/core

# npm
npm install @tortoise-os/core
```

## 🎯 What's Included

This package provides the foundational utilities, constants, and types used across all TortoiseOS packages.

### Constants
- **Network configurations** - Sui network endpoints (localnet, devnet, testnet, mainnet)
- **Protocol constants** - Default values, gas limits, timeouts
- **Type identifiers** - Common Sui Move type strings

### Logger
Structured logging utility with customizable log levels:

```typescript
import { logger } from '@tortoise-os/core';

logger.info('Connecting to Sui network', { network: 'devnet' });
logger.error('Transaction failed', { digest: '0x...' });
logger.debug('Debug information', { data: {...} });
```

### Types
Common TypeScript types for Sui development:

```typescript
import type { Network, SuiAddress, ObjectId } from '@tortoise-os/core';

const network: Network = 'devnet';
const walletAddress: SuiAddress = '0x...';
const nftId: ObjectId = '0x...';
```

### Utilities
Helper functions for common operations:

```typescript
import { formatAddress, isValidAddress, parseAmount } from '@tortoise-os/core';

// Shorten wallet addresses for display
const short = formatAddress('0x1234567890abcdef...');
// → '0x1234...cdef'

// Validate Sui addresses
if (isValidAddress(address)) {
  // Safe to use
}

// Parse token amounts with decimals
const amount = parseAmount('1.5', 9); // SUI has 9 decimals
// → 1500000000
```

## 📚 API Reference

### Constants

```typescript
export const NETWORKS = {
  LOCALNET: 'http://localhost:9000',
  DEVNET: 'https://fullnode.devnet.sui.io',
  TESTNET: 'https://fullnode.testnet.sui.io',
  MAINNET: 'https://fullnode.mainnet.sui.io',
};

export const DEFAULT_GAS_BUDGET = 10_000_000; // 0.01 SUI
export const MAX_GAS_BUDGET = 1_000_000_000; // 1 SUI
```

### Logger

```typescript
interface Logger {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}
```

### Types

```typescript
type Network = 'localnet' | 'devnet' | 'testnet' | 'mainnet';
type SuiAddress = `0x${string}`;
type ObjectId = `0x${string}`;
type TransactionDigest = string;
```

### Utilities

```typescript
// Format addresses for display
function formatAddress(address: string, length?: number): string;

// Validate Sui address format
function isValidAddress(address: string): boolean;

// Parse amounts with decimal places
function parseAmount(amount: string, decimals: number): bigint;

// Format amounts for display
function formatAmount(amount: bigint, decimals: number): string;
```

## 🏗️ Usage in Other Packages

This package is used as the foundation for all other TortoiseOS packages:

```typescript
// In @tortoise-os/sdk
import { NETWORKS, logger } from '@tortoise-os/core';

// In @tortoise-os/hooks
import type { Network, SuiAddress } from '@tortoise-os/core';

// In @tortoise-os/components
import { formatAddress } from '@tortoise-os/core';
```

## 🔧 Development

```bash
# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format
```

## 🤝 Contributing

This is a core package - changes here affect the entire ecosystem. Please:
- Write tests for new utilities
- Update types carefully (breaking changes affect all packages)
- Keep the bundle size small
- Document all exports

## 📄 License

MIT © TortoiseOS Team

## 🔗 Links

- [TortoiseOS Documentation](https://github.com/tortoise-os/bun-move)
- [Report Issues](https://github.com/tortoise-os/bun-move/issues)
- [Sui Documentation](https://docs.sui.io)

---

**Part of the TortoiseOS ecosystem** 🐢

Built with Bun, optimized for Sui.
