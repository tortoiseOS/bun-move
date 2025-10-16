/**
 * Utility functions for TortoiseOS
 */

export function formatSuiAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidSuiAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}

export function toBigIntSafe(value: string | number | bigint): bigint {
  try {
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
}
