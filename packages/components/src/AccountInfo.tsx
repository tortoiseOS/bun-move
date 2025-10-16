/**
 * Component for displaying account information
 */

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiBalance, useObjectOwned } from "@bun-move/hooks";
import { Card, Flex, Text, Heading, Separator } from "@radix-ui/themes";
import { Address } from "./Address";
import { Balance } from "./Balance";

export function AccountInfo() {
  const account = useCurrentAccount();
  const { data: balance } = useSuiBalance();
  const { data: objects } = useObjectOwned();

  if (!account) {
    return (
      <Card>
        <Text color="gray">No wallet connected</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Heading size="4">Account</Heading>

        <Separator size="4" />

        <Address address={account.address} label="Address" format="long" />

        <Separator size="4" />

        <Flex direction="column" gap="3">
          <Heading size="3">Balances</Heading>
          <Balance watch label="SUI" />
        </Flex>

        <Separator size="4" />

        <Flex direction="column" gap="2">
          <Heading size="3">Objects</Heading>
          <Text color="gray">
            {objects?.length || 0} objects owned
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
