/**
 * Component for displaying Sui objects (NFTs, etc.)
 */

import { useObject } from "@bun-move/hooks";
import { Card, Flex, Text, Skeleton, Code } from "@radix-ui/themes";
import { ExplorerLink } from "./ExplorerLink";

export interface ObjectDisplayProps {
  objectId: string;
}

export function ObjectDisplay({ objectId }: ObjectDisplayProps) {
  const { data: object, isLoading } = useObject(objectId);

  if (isLoading) {
    return (
      <Card>
        <Skeleton width="100%" height="150px" />
      </Card>
    );
  }

  if (!object || !object.data) {
    return (
      <Card>
        <Text color="gray">Object not found</Text>
      </Card>
    );
  }

  const content = object.data.content;
  const type = object.data.type;

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="2" weight="bold">
            Object
          </Text>
          <ExplorerLink objectId={objectId} />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="1" color="gray">
            ID
          </Text>
          <Code size="1">{objectId.slice(0, 20)}...</Code>
        </Flex>

        {type && (
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">
              Type
            </Text>
            <Code size="1">{type}</Code>
          </Flex>
        )}

        {content && content.dataType === "moveObject" && (
          <Flex direction="column" gap="2">
            <Text size="1" color="gray">
              Fields
            </Text>
            <Code size="1">
              <pre>{JSON.stringify(content.fields, null, 2)}</pre>
            </Code>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
