/**
 * Enhanced wallet connection button
 */

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Button, Flex } from "@radix-ui/themes";
import { formatSuiAddress } from "@bun-move/core";

export function WalletButton() {
  const account = useCurrentAccount();

  if (account) {
    return (
      <Flex align="center" gap="2">
        <ConnectButton />
      </Flex>
    );
  }

  return <ConnectButton />;
}

/**
 * Custom styled wallet button
 */
export interface CustomWalletButtonProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function CustomWalletButton({
  onConnect,
  onDisconnect,
}: CustomWalletButtonProps) {
  const account = useCurrentAccount();

  if (account) {
    return (
      <Button
        variant="soft"
        onClick={() => {
          // Disconnect logic
          onDisconnect?.();
        }}
      >
        {formatSuiAddress(account.address)}
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        // Connect logic
        onConnect?.();
      }}
    >
      Connect Wallet
    </Button>
  );
}
