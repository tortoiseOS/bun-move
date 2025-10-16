/**
 * Component for transaction buttons with loading states
 */

import { Button } from "@radix-ui/themes";
import type { ReactNode } from "react";

export interface TransactionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
  variant?: "solid" | "soft" | "outline";
  color?: "blue" | "green" | "red" | "gray";
  size?: "1" | "2" | "3" | "4";
}

export function TransactionButton({
  onClick,
  isLoading,
  isDisabled,
  children,
  variant = "solid",
  color = "blue",
  size = "3",
}: TransactionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || isDisabled}
      variant={variant}
      color={color}
      size={size}
      style={{ minWidth: "120px" }}
    >
      {isLoading ? "Processing..." : children}
    </Button>
  );
}
