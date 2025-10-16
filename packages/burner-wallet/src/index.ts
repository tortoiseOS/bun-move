/**
 * @bun-move/burner-wallet
 * Burner wallet for local development
 * Auto-creates and funds wallets for testing
 */

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";
import { createLogger } from "@bun-move/core";

const logger = createLogger("BurnerWallet");

const BURNER_WALLET_KEY = "tortoise-burner-wallet";

export interface BurnerWalletConfig {
  persist?: boolean;
  autoFund?: boolean;
  faucetUrl?: string;
}

export class BurnerWallet {
  private keypair: Ed25519Keypair;
  private config: BurnerWalletConfig;

  constructor(config: BurnerWalletConfig = {}) {
    this.config = {
      persist: true,
      autoFund: true,
      faucetUrl: "http://localhost:9123/gas",
      ...config,
    };

    this.keypair = this.loadOrCreate();
    logger.info(`Burner wallet initialized: ${this.getAddress()}`);
  }

  private loadOrCreate(): Ed25519Keypair {
    if (!this.config.persist) {
      return this.createNew();
    }

    try {
      const stored = localStorage.getItem(BURNER_WALLET_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        logger.info("Loaded existing burner wallet from storage");
        return Ed25519Keypair.fromSecretKey(fromB64(parsed.secretKey));
      }
    } catch (error) {
      logger.warn("Failed to load burner wallet, creating new one");
    }

    return this.createNew();
  }

  private createNew(): Ed25519Keypair {
    const keypair = new Ed25519Keypair();

    if (this.config.persist) {
      try {
        const secretKey = keypair.getSecretKey();
        localStorage.setItem(
          BURNER_WALLET_KEY,
          JSON.stringify({
            secretKey: Buffer.from(secretKey).toString("base64"),
          })
        );
        logger.info("Created and saved new burner wallet");
      } catch (error) {
        logger.error("Failed to save burner wallet");
      }
    }

    return keypair;
  }

  getAddress(): string {
    return this.keypair.toSuiAddress();
  }

  getKeypair(): Ed25519Keypair {
    return this.keypair;
  }

  async requestFunds(): Promise<boolean> {
    if (!this.config.autoFund || !this.config.faucetUrl) {
      return false;
    }

    try {
      logger.info("Requesting funds from faucet...");

      const response = await fetch(this.config.faucetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FixedAmountRequest: {
            recipient: this.getAddress(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Faucet request failed: ${response.statusText}`);
      }

      logger.info("✅ Funds received from faucet");
      return true;
    } catch (error: any) {
      logger.error("Failed to request funds:", error.message);
      return false;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(BURNER_WALLET_KEY);
      logger.info("Burner wallet cleared");
    } catch (error) {
      logger.error("Failed to clear burner wallet");
    }
  }

  static isBurnerWalletSupported(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }
}

/**
 * Create burner wallet instance
 */
export function createBurnerWallet(
  config?: BurnerWalletConfig
): BurnerWallet {
  return new BurnerWallet(config);
}

/**
 * Get or create burner wallet (singleton pattern)
 */
let instance: BurnerWallet | null = null;

export function getBurnerWallet(config?: BurnerWalletConfig): BurnerWallet {
  if (!instance) {
    instance = new BurnerWallet(config);
  }
  return instance;
}
