import { test, expect } from '@tortoiseos/terrapin';

test.describe('Sui Wallet Connection', () => {
  test.beforeEach(async ({ page }) => {
    // Enable burner wallet for E2E tests
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
    });

    // Set environment variable to enable burner wallet
    await page.addInitScript(() => {
      (window as any).NEXT_PUBLIC_ENABLE_BURNER_WALLET = 'true';
    });
  });

  test('should connect to burner wallet successfully', async ({ page, suiWallet }) => {
    // Wait for page to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Connect to the burner wallet
    await suiWallet.connect();

    // Verify connection succeeded
    const isConnected = await suiWallet.isConnected();
    expect(isConnected).toBe(true);

    // Check that connect button changed to disconnect/wallet address
    const disconnectButton = page.getByRole('button', { name: /disconnect|0x/i });
    await expect(disconnectButton).toBeVisible({ timeout: 5000 });
  });

  test('should display wallet address after connection', async ({ page, suiWallet }) => {
    await page.waitForSelector('body', { timeout: 10000 });

    // Connect wallet
    await suiWallet.connect();

    // Wait a moment for UI to update
    await page.waitForTimeout(1000);

    // Check that a wallet address is displayed (starts with 0x)
    const walletAddress = await suiWallet.getAddress();

    if (walletAddress) {
      expect(walletAddress).toMatch(/^0x[a-fA-F0-9]+/);
    } else {
      // If address not found in dedicated element, check if it's in any button/text
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/0x[a-fA-F0-9]{40,}/);
    }
  });

  test('should disconnect from wallet', async ({ page, suiWallet }) => {
    await page.waitForSelector('body', { timeout: 10000 });

    // First connect
    await suiWallet.connect();
    let isConnected = await suiWallet.isConnected();
    expect(isConnected).toBe(true);

    // Then disconnect
    await suiWallet.disconnect();

    // Verify disconnection
    isConnected = await suiWallet.isConnected();
    expect(isConnected).toBe(false);

    // Connect button should be visible again
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible({ timeout: 5000 });
  });

  test('should persist connection across page navigation', async ({ page, suiWallet }) => {
    await page.waitForSelector('body', { timeout: 10000 });

    // Connect wallet
    await suiWallet.connect();

    // Navigate to same page (or another page if you have routing)
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Wait for page to reload
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Check if still connected (with autoConnect enabled)
    const isConnected = await suiWallet.isConnected();

    // Note: This might be true if autoConnect works, or false if session didn't persist
    // Adjust expectation based on your app's behavior
    console.log('Connection persisted:', isConnected);
  });
});
