/**
 * Common types for TortoiseOS
 */

export interface DeployedContract {
  packageId: string;
  moduleName: string;
  network: string;
  deployedAt: number;
  abi?: any;
}

export interface ContractRegistry {
  [network: string]: {
    [moduleName: string]: DeployedContract;
  };
}

export interface AIConfig {
  walrusEndpoint?: string;
  walrusBucketId?: string;
  nautilusEndpoint?: string;
  nautilusApiKey?: string;
  enabled: boolean;
}

export interface TortoiseConfig {
  network: string;
  rpcUrl: string;
  faucetUrl?: string;
  ai: AIConfig;
}
