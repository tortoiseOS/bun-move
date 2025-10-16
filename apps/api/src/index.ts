/**
 * TortoiseOS API
 * Elysia backend for TortoiseOS
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { createLogger } from "@bun-move/core";
import { healthRoutes } from "./routes/health";
import { suiRoutes } from "./routes/sui";

const logger = createLogger("API");

const PORT = process.env.API_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "TortoiseOS API",
          version: "0.1.0",
          description: "AI-Native DeFi Operating System on Sui",
        },
        tags: [
          { name: "Health", description: "Health check endpoints" },
          { name: "Sui", description: "Sui blockchain interactions" },
          { name: "AI", description: "AI/TEE integration endpoints" },
        ],
      },
    })
  )
  .onError(({ code, error, set }) => {
    logger.error(`[${code}] ${error.message}`);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Not found" };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation failed", details: error.message };
    }

    set.status = 500;
    return { error: "Internal server error" };
  })
  .use(healthRoutes)
  .use(suiRoutes)
  .listen(PORT);

logger.info(`🚀 TortoiseOS API running at http://localhost:${PORT}`);
logger.info(`📚 API docs: http://localhost:${PORT}/swagger`);
logger.info(`🌍 Environment: ${NODE_ENV}`);

export type App = typeof app;
