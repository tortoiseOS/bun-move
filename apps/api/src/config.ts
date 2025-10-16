/**
 * API configuration
 */

export const config = {
  port: parseInt(process.env.API_PORT || "3001"),
  nodeEnv: process.env.NODE_ENV || "development",
  suiNetwork: process.env.SUI_NETWORK || "localnet",
  suiRpcUrl: process.env.SUI_RPC_URL || "http://localhost:9000",
  ai: {
    walrusEndpoint: process.env.WALRUS_ENDPOINT,
    walrusBucketId: process.env.WALRUS_BUCKET_ID,
    nautilusEndpoint: process.env.NAUTILUS_TEE_ENDPOINT,
    nautilusApiKey: process.env.NAUTILUS_API_KEY,
    enabled: process.env.SUI_AI_AGENT_ENABLED === "true",
  },
} as const;

export function validateConfig() {
  if (!config.suiRpcUrl) {
    throw new Error("SUI_RPC_URL is required");
  }
}
