# @tortoise-os/terrapin 🐢💧

> Where tortoises meet the water - Playwright testing utilities for Sui blockchain dApps

[![npm version](https://img.shields.io/npm/v/@tortoise-os/terrapin.svg)](https://www.npmjs.com/package/@tortoise-os/terrapin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TortoiseOS](https://img.shields.io/badge/🐢-TortoiseOS-green)](https://tortoise-os.com)

**Terrapin** is a specialized Playwright testing library for Sui blockchain applications. Just like a terrapin (freshwater turtle) thrives where land meets water, this library bridges TortoiseOS and Sui (水 - water), providing fixtures and helpers to simplify E2E testing of Sui wallet interactions, transactions, and dApp flows.

## Why This Package?

Testing Sui dApps is different from Ethereum dApps:
- ❌ **Synpress doesn't work** - it's built for MetaMask/EVM wallets only
- ❌ **No mature Sui-specific tools** exist (as of 2025)
- ✅ **This package fills the gap** - purpose-built for Sui with @mysten/dapp-kit

## Features

✅ **Easy wallet connection testing** - Connect/disconnect with one line
✅ **Transaction helpers** - Wait for transactions, check status
✅ **Network detection** - Verify correct network (localnet/devnet/etc)
✅ **Custom Matchers** - Sui-specific assertions for cleaner tests
✅ **Pre-configured Test Wallets** - Realistic wallet presets (whale, normie, empty, etc)
✅ **CI/CD Templates** - Ready-to-use GitHub Actions & GitLab CI configs
✅ **TypeScript support** - Full type safety and IDE autocomplete
✅ **Works with @mysten/dapp-kit** - Uses official unsafe burner wallet
✅ **Zero configuration** - Just install and use
✅ **Production-ready** - Used in TortoiseOS DeFi suite

---

## Installation

```bash
# bun (recommended)
bun add -D @tortoise-os/terrapin

# npm
npm install --save-dev @tortoise-os/terrapin

# pnpm
pnpm add -D @tortoise-os/terrapin

# yarn
yarn add -D @tortoise-os/terrapin
```

### Peer Dependencies

This package requires:
- `@playwright/test` ^1.40.0

---

## Quick Start

### 1. Enable Unsafe Burner Wallet

In your app's wallet provider, enable the burner wallet for tests:

```typescript
// app/providers.tsx or similar
import { WalletProvider } from '@mysten/dapp-kit';

const isTestEnvironment = process.env.NODE_ENV === 'test' ||
  process.env.NEXT_PUBLIC_ENABLE_BURNER_WALLET === 'true';

export function Providers({ children }) {
  return (
    <WalletProvider enableUnsafeBurner={isTestEnvironment}>
      {children}
    </WalletProvider>
  );
}
```

### 2. Configure Playwright

Update your `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ... other config
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    env: {
      // Enable burner wallet for tests
      NEXT_PUBLIC_ENABLE_BURNER_WALLET: 'true',
      NEXT_PUBLIC_SUI_NETWORK: 'localnet',
    },
  },
});
```

### 3. Write Your First Test

```typescript
// tests/wallet.spec.ts
import { test, expect } from '@tortoise-os/terrapin';

test('should connect to Sui wallet', async ({ page, suiWallet }) => {
  await page.goto('/');

  // Connect to wallet
  await suiWallet.connect();

  // Verify connection
  expect(await suiWallet.isConnected()).toBe(true);

  // Get wallet address
  const address = await suiWallet.getAddress();
  expect(address).toMatch(/^0x[a-fA-F0-9]{40,}/);
});
```

### 4. Run Tests

```bash
bunx playwright test
```

---

## API Reference

### `suiWallet.connect()`

Connects to the Sui burner wallet.

```typescript
await suiWallet.connect();
```

**Throws**: Error if connection fails or button not found

---

### `suiWallet.disconnect()`

Disconnects from the current wallet.

```typescript
await suiWallet.disconnect();
```

---

### `suiWallet.isConnected()`

Checks if a wallet is currently connected.

```typescript
const connected = await suiWallet.isConnected();
expect(connected).toBe(true);
```

**Returns**: `Promise<boolean>`

---

### `suiWallet.getAddress()`

Gets the currently connected wallet address.

```typescript
const address = await suiWallet.getAddress();
console.log(address); // "0x1234..."
```

**Returns**: `Promise<string | null>` - Address or null if not found

---

### `suiWallet.waitForTransaction(timeout?)`

Waits for a transaction to complete.

```typescript
// Click button that sends transaction
await page.click('[data-testid="send-button"]');

// Wait for it to complete (default 10s timeout)
await suiWallet.waitForTransaction();

// Or with custom timeout
await suiWallet.waitForTransaction(15000); // 15 seconds
```

**Parameters**:
- `timeout` - Maximum wait time in milliseconds (default: 10000)

**Throws**: Error if transaction doesn't complete within timeout

---

### `suiWallet.getNetwork()`

Gets the current network name.

```typescript
const network = await suiWallet.getNetwork();
expect(network).toBe('localnet');
```

**Returns**: `Promise<string | null>` - Network name or null

---

## Usage Examples

### Basic Wallet Connection

```typescript
import { test, expect } from '@tortoise-os/terrapin';

test('wallet connection flow', async ({ page, suiWallet }) => {
  await page.goto('/');

  // Initially not connected
  expect(await suiWallet.isConnected()).toBe(false);

  // Connect wallet
  await suiWallet.connect();
  expect(await suiWallet.isConnected()).toBe(true);

  // Disconnect
  await suiWallet.disconnect();
  expect(await suiWallet.isConnected()).toBe(false);
});
```

### Testing Transactions

```typescript
test('should transfer tokens', async ({ page, suiWallet }) => {
  await page.goto('/transfer');
  await suiWallet.connect();

  // Fill in transfer form
  await page.fill('[data-testid="recipient"]', '0x123...');
  await page.fill('[data-testid="amount"]', '100');

  // Submit transaction
  await page.click('[data-testid="transfer-button"]');

  // Wait for it to complete
  await suiWallet.waitForTransaction(15000);

  // Verify success
  await expect(page.getByText(/transfer successful/i)).toBeVisible();
});
```

### Testing Swap/DeFi Operations

```typescript
test('should swap tokens', async ({ page, suiWallet }) => {
  await page.goto('/swap');
  await suiWallet.connect();

  // Select tokens
  await page.selectOption('[data-testid="token-in"]', 'SUI');
  await page.selectOption('[data-testid="token-out"]', 'USDC');

  // Enter amount
  await page.fill('[data-testid="amount-in"]', '10');

  // Execute swap
  await page.click('[data-testid="swap-button"]');

  // Wait for swap transaction
  await suiWallet.waitForTransaction();

  // Check balance updated
  const balance = await page.textContent('[data-testid="usdc-balance"]');
  expect(parseFloat(balance || '0')).toBeGreaterThan(0);
});
```

### Multi-Step User Flows

```typescript
test('complete user journey', async ({ page, suiWallet }) => {
  // Step 1: Connect wallet
  await page.goto('/');
  await suiWallet.connect();

  // Step 2: Navigate to vault
  await page.click('text=Vaults');
  await expect(page).toHaveURL(/.*vaults/);

  // Step 3: Deposit into vault
  await page.click('[data-testid="vault-sui"]');
  await page.fill('[data-testid="deposit-amount"]', '50');
  await page.click('[data-testid="deposit-button"]');
  await suiWallet.waitForTransaction();

  // Step 4: Verify deposit
  const shares = await page.textContent('[data-testid="vault-shares"]');
  expect(parseFloat(shares || '0')).toBeGreaterThan(0);

  // Step 5: Clean up - disconnect
  await suiWallet.disconnect();
});
```

### Testing Network Detection

```typescript
test('should be on correct network', async ({ page, suiWallet }) => {
  await page.goto('/');
  await suiWallet.connect();

  const network = await suiWallet.getNetwork();
  expect(network).toBe('localnet');

  // Or check in UI
  await expect(page.getByText(/localnet/i)).toBeVisible();
});
```

---

## Best Practices

### 1. Use Data Test IDs

Add `data-testid` attributes to your components for stable selectors:

```tsx
// Good ✅
<button data-testid="connect-wallet">Connect</button>
<input data-testid="amount-input" />

// Avoid ❌
<button className="btn-primary">Connect</button>
```

### 2. Wait for Page Load

Always wait for the page to be ready before interacting:

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body');
});
```

### 3. Clean Up After Tests

The package automatically disconnects wallets after tests, but you can add custom cleanup:

```typescript
test.afterEach(async ({ suiWallet }) => {
  // Additional cleanup if needed
  if (await suiWallet.isConnected()) {
    await suiWallet.disconnect();
  }
});
```

### 4. Handle Transaction Timeouts

Set appropriate timeouts for slow transactions:

```typescript
// Default 10s might not be enough for complex operations
await suiWallet.waitForTransaction(30000); // 30 seconds for complex tx
```

### 5. Use Test Networks

Always test on localnet or devnet, never mainnet:

```typescript
// playwright.config.ts
env: {
  NEXT_PUBLIC_SUI_NETWORK: 'localnet', // or 'devnet'
}
```

---

## Troubleshooting

### "Connect wallet button not found"

**Problem**: Test fails to find connect button

**Solution**:
- Ensure your app has a visible "Connect Wallet" button
- Check the button text matches `/connect wallet/i` regex
- Wait for page to load: `await page.waitForSelector('button')`

### "Wallet connection failed"

**Problem**: `connect()` succeeds but `isConnected()` returns false

**Solution**:
- Verify `enableUnsafeBurner={true}` is set in WalletProvider
- Check `NEXT_PUBLIC_ENABLE_BURNER_WALLET=true` in env
- Increase wait time after connect: `await page.waitForTimeout(2000)`

### "Transaction never completes"

**Problem**: `waitForTransaction()` times out

**Solution**:
- Ensure Sui localnet is running: `sui start`
- Increase timeout: `waitForTransaction(30000)`
- Check if transaction actually started (look for errors in browser console)

### "Address not found"

**Problem**: `getAddress()` returns null

**Solution**:
- Add `data-testid="wallet-address"` to your address display component
- Ensure address is rendered in the DOM after connection
- Check if address is abbreviated (e.g., "0x123...abc")

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Install Playwright
        run: bunx playwright install --with-deps chromium

      - name: Install Sui CLI
        run: |
          curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
          source "$HOME/.cargo/env"
          cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui

      - name: Start Sui localnet
        run: |
          export PATH="$HOME/.cargo/bin:$PATH"
          sui start &
          sleep 10

      - name: Build and test
        run: |
          bun run build
          bun run test:e2e
        env:
          NEXT_PUBLIC_ENABLE_BURNER_WALLET: 'true'
          NEXT_PUBLIC_SUI_NETWORK: 'localnet'
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Advanced Features

### Custom Matchers

Write cleaner, more readable tests with Sui-specific assertions:

```typescript
import { expectWithMatchers as expect } from '@tortoise-os/terrapin';

test('wallet assertions', async ({ page, suiWallet }) => {
  await page.goto('/');

  // Assert wallet is connected
  await expect(suiWallet).toHaveConnectedWallet();

  // Assert wallet has balance
  await expect(page).toHaveBalance('SUI', 100);

  // Assert wallet address is shown
  await expect(page).toShowWalletAddress('0x123...');

  // Assert network is correct
  await expect(page).toShowNetwork('localnet');

  // Assert transaction completed
  await page.click('[data-testid="send-button"]');
  await expect(page).toHaveCompletedTransaction({ timeout: 15000 });

  // Assert success/error messages
  await expect(page).toShowSuccess('Transaction completed');
  await expect(page).toShowError(); // Check for any error
});
```

**Available Matchers:**

| Matcher | Description | Example |
|---------|-------------|---------|
| `toHaveConnectedWallet()` | Asserts wallet is connected | `await expect(suiWallet).toHaveConnectedWallet()` |
| `toHaveBalance(token, amount)` | Asserts balance for a token | `await expect(page).toHaveBalance('SUI', 100)` |
| `toShowWalletAddress(address?)` | Asserts wallet address is displayed | `await expect(page).toShowWalletAddress()` |
| `toHaveCompletedTransaction(options?)` | Asserts transaction completed | `await expect(page).toHaveCompletedTransaction()` |
| `toShowNetwork(network)` | Asserts network name is shown | `await expect(page).toShowNetwork('localnet')` |
| `toShowError(message?)` | Asserts error message is displayed | `await expect(page).toShowError('Insufficient funds')` |
| `toShowSuccess(message?)` | Asserts success message is displayed | `await expect(page).toShowSuccess('Transfer complete')` |

### Pre-Configured Test Wallets

Use realistic wallet presets for different testing scenarios:

```typescript
import { test, expect } from '@tortoise-os/terrapin';
import { TEST_WALLETS, getTestWallet, suiToMist, formatBalance } from '@tortoise-os/terrapin';

test('test with whale wallet', async ({ page }) => {
  // Get a pre-configured whale wallet
  const whale = getTestWallet('whale');

  console.log(whale.name); // "Whale"
  console.log(whale.balances.SUI); // 1,000,000,000,000,000 MIST (1M SUI)
  console.log(formatBalance(whale.balances.SUI)); // "1,000,000 SUI"
});

test('test with poor wallet', async ({ page }) => {
  const poor = getTestWallet('poor');

  console.log(poor.balances.SUI); // 500,000,000 MIST (0.5 SUI)
  console.log(poor.description); // "Wallet with minimal funds"
});

// Helper functions
test('balance calculations', async () => {
  const amount = suiToMist(10); // Convert 10 SUI to MIST
  expect(amount).toBe(10_000_000_000);

  const sui = mistToSui(10_000_000_000); // Convert MIST to SUI
  expect(sui).toBe(10);

  const formatted = formatBalance(10_000_000_000); // "10 SUI"
  expect(formatted).toBe('10 SUI');
});
```

**Available Wallet Presets:**

| Wallet | SUI Balance | Use Case |
|--------|-------------|----------|
| `whale` | 1,000,000 SUI | Testing high-value transactions |
| `normie` | 100 SUI | Normal user testing |
| `degen` | 10,000 SUI | Testing risky DeFi operations |
| `poor` | 0.5 SUI | Testing insufficient balance scenarios |
| `empty` | 0 SUI | Testing zero balance edge cases |
| `nftCollector` | 1,000 SUI + NFTs | Testing NFT features |
| `gasSponsor` | 10,000 SUI | Testing gas sponsorship |
| `staker` | 50,000 SUI | Testing staking operations |
| `multiToken` | Multiple tokens | Testing multi-token scenarios |

### CI/CD Templates

Get up and running with CI/CD in minutes using our ready-to-use templates:

#### GitHub Actions

```bash
# Copy template to your repo
cp node_modules/@tortoise-os/terrapin/templates/github-actions.yml .github/workflows/e2e.yml

# Commit and push
git add .github/workflows/e2e.yml
git commit -m "Add E2E testing workflow"
git push
```

**Features:**
- Multi-browser testing matrix
- Automatic Sui localnet setup
- Test report uploads
- GitHub Pages deployment
- PR comments with results

#### GitLab CI

```bash
# Copy template to your repo
cp node_modules/@tortoise-os/terrapin/templates/gitlab-ci.yml .gitlab-ci.yml

# Commit and push
git add .gitlab-ci.yml
git commit -m "Add E2E testing pipeline"
git push
```

**Features:**
- Multi-stage pipeline
- Caching for faster runs
- Artifact uploads
- Pages deployment
- JUnit reports

See [templates/README.md](./templates/README.md) for detailed customization options.

---

## Roadmap & Feature Priorities

We've organized upcoming features by priority based on impact, effort, and ROI:

| Priority | Feature | Impact | Effort | ROI | Status |
|----------|---------|--------|--------|-----|--------|
| 🔥 **P0** | **Custom Matchers** | ⭐⭐⭐⭐⭐ | Medium | ⚡⚡⚡⚡⚡ | ✅ **Done** |
| 🔥 **P0** | **Pre-Configured Wallets** | ⭐⭐⭐⭐⭐ | Low | ⚡⚡⚡⚡⚡ | ✅ **Done** |
| 🔥 **P0** | **CI/CD Templates** | ⭐⭐⭐⭐ | Low | ⚡⚡⚡⚡⚡ | ✅ **Done** |
| 🚀 **P1** | Transaction Builders | ⭐⭐⭐⭐⭐ | Medium | ⚡⚡⚡⚡⭐ | 📋 Planned |
| 🚀 **P1** | Event Listening | ⭐⭐⭐⭐ | Medium | ⚡⚡⚡⚡ | 📋 Planned |
| 🚀 **P1** | Network Mocking | ⭐⭐⭐⭐ | High | ⚡⚡⚡ | 📋 Planned |
| 💡 **P2** | Visual Regression | ⭐⭐⭐ | High | ⚡⚡⚡ | 🤔 Considering |
| 💡 **P2** | Multi-Wallet Testing | ⭐⭐⭐⭐ | High | ⚡⚡ | 🤔 Considering |
| 💡 **P2** | Performance Benchmarking | ⭐⭐⭐ | Medium | ⚡⚡⚡ | 🤔 Considering |
| 🎯 **P3** | Component Testing | ⭐⭐ | High | ⚡⚡ | 💭 Future |
| 🎯 **P3** | Real Wallet Extensions | ⭐⭐⭐⭐ | Very High | ⚡ | 💭 Future |

### Quick-Win Features (P0) - ✅ Completed

These provide the highest ROI with minimal effort:

**✅ Custom Matchers**
- Reduces test boilerplate by 50%+
- Makes tests more readable and maintainable
- Examples: `toHaveConnectedWallet()`, `toShowWalletAddress()`

**✅ Pre-Configured Wallets**
- Instant test setup with realistic balances
- 9 wallet presets for different scenarios
- Helper functions: `suiToMist()`, `formatBalance()`

**✅ CI/CD Templates**
- One-command CI/CD setup
- GitHub Actions and GitLab CI
- Includes Sui localnet and test reporting

### High-Impact Features (P1) - 📋 Planned

**Transaction Builders**
```typescript
await suiWallet.transaction()
  .transfer('0x123...', 100_000)
  .split(coin, [50, 50])
  .execute();
```
- Simplifies complex transactions
- Type-safe transaction building
- Reduces manual PTB construction

**Event Listening**
```typescript
await suiWallet.waitForEvent('Transfer', { timeout: 5000 });
await expect(page).toHaveEmittedEvent('ObjectCreated');
```
- Wait for specific blockchain events
- Verify event data
- Better transaction verification

**Network Mocking**
```typescript
await suiWallet.mockNetwork({
  rpc: 'http://localhost:9000',
  chainId: 'local-test'
});
```
- Faster tests without real network
- Deterministic test behavior
- Offline testing support

### Medium-Impact Features (P2) - 🤔 Considering

**Visual Regression Testing**
- Screenshot comparison for UI changes
- Wallet connection flow screenshots
- Transaction confirmation dialogs

**Multi-Wallet Testing**
- Test interactions between multiple wallets
- Transfer between accounts
- Multi-sig scenarios

**Performance Benchmarking**
- Measure transaction speed
- Track test execution time
- Identify performance regressions

### Future Considerations (P3) - 💭 Long-term

**Component Testing**
- Test individual React components
- Mock wallet context
- Faster than E2E tests

**Real Wallet Extensions**
- Test with Sui Wallet browser extension
- Test Ethos/Martian wallets
- More realistic but complex setup

---

## Comparison with Other Tools

| Feature | @tortoise-os/terrapin | Synpress | Manual Playwright |
|---------|--------------------------|----------|-------------------|
| **Sui Support** | ✅ Native | ❌ No | ⚠️ Manual |
| **Wallet Connection** | ✅ One-liner | ❌ N/A | ⚠️ ~50 lines |
| **Transaction Handling** | ✅ Built-in | ❌ N/A | ⚠️ Manual |
| **TypeScript** | ✅ Full support | ✅ Yes | ✅ Yes |
| **Setup Complexity** | ✅ Low | ❌ High | ⚠️ Medium |
| **CI-Friendly** | ✅ Very | ⚠️ Moderate | ✅ Yes |

---

## Requirements

- **Node.js** >= 18.0.0
- **@playwright/test** >= 1.40.0
- **@mysten/dapp-kit** >= 0.14.0 (in your app)
- **Sui CLI** (for localnet testing)

---

## Changelog

### v0.2.0 (2025-10-18)

- ✨ Custom Matchers for cleaner assertions
- ✨ Pre-configured test wallets (9 presets)
- ✨ CI/CD templates (GitHub Actions + GitLab CI)
- 📚 Expanded documentation with advanced features
- 🎯 Roadmap with feature priorities

### v0.1.0 (2025-01-17)

- 🎉 Initial release
- ✅ Wallet connection helpers
- ✅ Transaction waiting
- ✅ Network detection
- ✅ Full TypeScript support
- ✅ Comprehensive documentation

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone repo
git clone https://github.com/yourusername/bun-move.git
cd bun-move

# Install dependencies
bun install

# Build package
cd packages/terrapin
bun run build

# Run tests
cd ../../apps/web
bun run test:e2e
```

---

## License

MIT © [TortoiseOS Team](https://github.com/yourusername/bun-move)

---

## Support

- 📖 [Documentation](https://github.com/yourusername/bun-move/tree/main/docs)
- 🐛 [Report Issues](https://github.com/yourusername/bun-move/issues)
- 💬 [Discussions](https://github.com/yourusername/bun-move/discussions)

---

## Related Packages

- [@tortoise-os/ui](../ui) - Magic UI components for Sui dApps
- [@tortoise-os/sdk](../sdk) - Sui SDK wrapper
- [@tortoise-os/hooks](../hooks) - React hooks for Sui

---

## About the Name

**Terrapin** (noun): A type of freshwater turtle that thrives where land meets water.

Just as a terrapin navigates both worlds with ease, **@tortoise-os/terrapin** seamlessly bridges TortoiseOS's steady, reliable approach with Sui's fluid blockchain technology (Sui 水 means "water" in Japanese).

**The philosophy**: Like the wise terrapin, we believe in steady, thorough testing - taking time to ensure quality while gracefully adapting to the flowing nature of blockchain development.

🐢 **Slow, steady, and thorough** - The terrapin way.

---

Made with ❤️ by the TortoiseOS team 🐢
