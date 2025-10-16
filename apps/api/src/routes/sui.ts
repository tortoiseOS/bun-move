/**
 * Sui blockchain routes
 */

import { Elysia, t } from "elysia";
import { createClient } from "@bun-move/sdk";
import { config } from "../config";

const client = createClient(config.suiNetwork as any);

export const suiRoutes = new Elysia({ prefix: "/sui", tags: ["Sui"] })
  .get(
    "/balance/:address",
    async ({ params }) => {
      const balance = await client.getBalance(params.address);
      return {
        address: params.address,
        balance: balance.toString(),
      };
    },
    {
      params: t.Object({
        address: t.String(),
      }),
    }
  )
  .get(
    "/object/:objectId",
    async ({ params }) => {
      const object = await client.getObject(params.objectId);
      return object;
    },
    {
      params: t.Object({
        objectId: t.String(),
      }),
    }
  );
