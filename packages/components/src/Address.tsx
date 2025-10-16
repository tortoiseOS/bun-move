/**
 * Component for displaying Sui addresses with formatting
 */

import { formatSuiAddress } from "@bun-move/core";
import { Flex, Text, Code } from "@radix-ui/themes";
import { CopyButton } from "./CopyButton";
import { ExplorerLink } from "./ExplorerLink";

export interface AddressProps {
  address: string;
  format?: "short" | "long";
  showCopy?: boolean;
  showExplorer?: boolean;
  label?: string;
}

export function Address({
  address,
  format = "short",
  showCopy = true,
  showExplorer = true,
  label,
}: AddressProps) {
  const displayAddress =
    format === "short" ? formatSuiAddress(address) : address;

  return (
    <Flex align="center" gap="2">
      {label && (
        <Text size="2" color="gray">
          {label}:
        </Text>
      )}
      <Code size="2">{displayAddress}</Code>
      {showCopy && <CopyButton text={address} />}
      {showExplorer && <ExplorerLink address={address} />}
    </Flex>
  );
}
