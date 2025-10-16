/**
 * Loading spinner component
 */

import { Flex, Spinner, Text } from "@radix-ui/themes";

export interface LoadingSpinnerProps {
  message?: string;
  size?: "1" | "2" | "3";
}

export function LoadingSpinner({
  message = "Loading...",
  size = "3",
}: LoadingSpinnerProps) {
  return (
    <Flex direction="column" align="center" gap="3" py="6">
      <Spinner size={size} />
      <Text color="gray">{message}</Text>
    </Flex>
  );
}
