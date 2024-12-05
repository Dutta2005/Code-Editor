import { Box, Text } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      as="header"
      py={4}
      px={8}
      bg="gray.900"
      color="white"
      borderBottom="1px solid"
      borderColor="gray.700"
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold" textAlign="center">
        Online Code Editor
      </Text>
    </Box>
  );
}
