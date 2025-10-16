/**
 * Constants for TortoiseOS
 */

export const NETWORKS = {
  LOCALNET: "localnet",
  DEVNET: "devnet",
  TESTNET: "testnet",
  MAINNET: "mainnet",
} as const;

export type NetworkType = (typeof NETWORKS)[keyof typeof NETWORKS];

export const RPC_ENDPOINTS: Record<NetworkType, string> = {
  localnet: "http://localhost:9000",
  devnet: "https://fullnode.devnet.sui.io",
  testnet: "https://fullnode.testnet.sui.io",
  mainnet: "https://fullnode.mainnet.sui.io",
};

export const FAUCET_ENDPOINTS: Record<NetworkType, string | null> = {
  localnet: "http://localhost:9123/gas",
  devnet: "https://faucet.devnet.sui.io/gas",
  testnet: "https://faucet.testnet.sui.io/gas",
  mainnet: null,
};

export const TORTOISE_OS_PRODUCTS = [
  "core",
  "amm",
  "vault",
  "stablecoin",
  "arb",
  "bridge",
  "rwa",
  "btcfi",
  "privacy",
  "prediction",
  "orderbook",
] as const;

export type TortoiseProduct = (typeof TORTOISE_OS_PRODUCTS)[number];

export const PRODUCT_NAMES: Record<TortoiseProduct, string> = {
  core: "TortoiseOS Core",
  amm: "TortoiseSwap (AMM)",
  vault: "TortoiseVault (Auto-Compounder)",
  stablecoin: "TortoiseUSD (NFT-Backed Stablecoin)",
  arb: "TortoiseArb (Arbitrage Bot)",
  bridge: "TortoiseBridgeX (Cross-Chain Router)",
  rwa: "TortoiseRWA (Real-World Asset Vault)",
  btcfi: "TortoiseBTCfi (Bitcoin Yield)",
  privacy: "TortoisePrivacy (Private Vault)",
  prediction: "TortoisePrediction (Prediction Market)",
  orderbook: "TortoiseOrderbook (CLOB)",
};
