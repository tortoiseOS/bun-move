/**
 * Copy to clipboard button
 */

import { useState } from "react";
import { IconButton } from "@radix-ui/themes";

export interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <IconButton
      size="1"
      variant="ghost"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? "✓" : "📋"}
    </IconButton>
  );
}
