import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TortoiseOS",
  description: "AI-Native DeFi Operating System on Sui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <Providers>{children}</Providers>
        </Theme>
      </body>
    </html>
  );
}
