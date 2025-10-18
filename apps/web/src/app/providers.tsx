"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFullnodeUrl } from "@mysten/sui.js/client";

const queryClient = new QueryClient();

const networks = {
  localnet: { url: "http://localhost:9000" },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

const network =
  (process.env.NEXT_PUBLIC_SUI_NETWORK as keyof typeof networks) || "localnet";

// Enable unsafe burner wallet for E2E tests and development
const isTestEnvironment =
  process.env.NODE_ENV === "test" ||
  process.env.NEXT_PUBLIC_ENABLE_BURNER_WALLET === "true";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={network}>
        <WalletProvider autoConnect enableUnsafeBurner={isTestEnvironment}>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
