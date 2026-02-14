import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Header({ user, onLogout }) {
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
      <HStack justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          Online Code Editor
        </Text>
        {user ? (
          <HStack>
            <Text fontSize="sm">Logged in as {user.name}</Text>
            <Button size="sm" colorScheme="red" variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </HStack>
        ) : (
          <HStack>
            <Text fontSize="sm" color="gray.300">
              Please login to save and manage code history.
            </Text>
            <Button as={RouterLink} to="/login" size="sm" colorScheme="purple">
              Login
            </Button>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}
