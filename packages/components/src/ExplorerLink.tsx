/**
 * Link to Sui Explorer
 */

import { Link, IconButton } from "@radix-ui/themes";

export interface ExplorerLinkProps {
  address?: string;
  objectId?: string;
  txDigest?: string;
  network?: string;
}

export function ExplorerLink({
  address,
  objectId,
  txDigest,
  network = "localnet",
}: ExplorerLinkProps) {
  const baseUrl =
    network === "localnet"
      ? "https://suiexplorer.com"
      : `https://suiexplorer.com/?network=${network}`;

  let url = baseUrl;
  if (address) {
    url += `/address/${address}`;
  } else if (objectId) {
    url += `/object/${objectId}`;
  } else if (txDigest) {
    url += `/txblock/${txDigest}`;
  }

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <IconButton size="1" variant="ghost" title="View in Explorer">
        🔗
      </IconButton>
    </Link>
  );
}
