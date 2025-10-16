/**
 * SDK types
 */

export interface TransactionResult {
  digest: string;
  effects: any;
  objectChanges: any[];
}

export interface DeploymentInfo {
  packageId: string;
  network: string;
  deployedAt: number;
  modules: string[];
}
