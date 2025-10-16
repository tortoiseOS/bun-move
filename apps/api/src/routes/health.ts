/**
 * Health check routes
 */

import { Elysia } from "elysia";
import { createClient } from "@bun-move/sdk";
import { config } from "../config";

export const healthRoutes = new Elysia({ prefix: "/health", tags: ["Health"] })
  .get("/", () => ({
    status: "ok",
    timestamp: Date.now(),
    version: "0.1.0",
  }))
  .get("/sui", async () => {
    try {
      const client = createClient(config.suiNetwork as any);
      const chainId = await client.suiClient.getChainIdentifier();

      return {
        status: "ok",
        network: config.suiNetwork,
        chainId,
        rpcUrl: config.suiRpcUrl,
      };
    } catch (error: any) {
      return {
        status: "error",
        error: error.message,
      };
    }
  });
