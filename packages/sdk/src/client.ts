/**
 * Sui client wrapper for TortoiseOS
 */

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { createLogger } from "@bun-move/core";
import type { NetworkType } from "@bun-move/core";

const logger = createLogger("TortoiseClient");

export class TortoiseClient {
  public suiClient: SuiClient;
  public network: NetworkType;

  constructor(network: NetworkType = "localnet") {
    this.network = network;
    const rpcUrl =
      network === "localnet"
        ? "http://localhost:9000"
        : getFullnodeUrl(network);

    this.suiClient = new SuiClient({ url: rpcUrl });
    logger.info(`Connected to ${network} at ${rpcUrl}`);
  }

  async getBalance(address: string, coinType?: string): Promise<bigint> {
    const balance = await this.suiClient.getBalance({
      owner: address,
      coinType,
    });
    return BigInt(balance.totalBalance);
  }

  async getObject(objectId: string) {
    return this.suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });
  }
}

export function createClient(network: NetworkType = "localnet"): TortoiseClient {
  return new TortoiseClient(network);
}
