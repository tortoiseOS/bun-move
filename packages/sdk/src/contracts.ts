/**
 * Contract interaction helpers
 */

import type { TortoiseClient } from "./client";
import type { Transaction } from "@mysten/sui.js/transactions";

export interface ContractCall {
  packageId: string;
  module: string;
  function: string;
  typeArguments?: string[];
  arguments: any[];
}

export class ContractInterface {
  constructor(
    private client: TortoiseClient,
    private packageId: string
  ) {}

  async call(
    module: string,
    functionName: string,
    args: any[] = [],
    typeArgs: string[] = []
  ) {
    // TODO: Build and execute transaction
    throw new Error("Not implemented");
  }

  async view(module: string, functionName: string, args: any[] = []) {
    // TODO: Execute view function
    throw new Error("Not implemented");
  }
}
