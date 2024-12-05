import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="#0f0a19"
      color="white"
      textAlign="center"
    >
      <Heading fontSize="6xl" mb={4}>
        404
      </Heading>
      <Text fontSize="xl" mb={6}>
        Oops! The page you're looking for doesn't exist.
      </Text>
      <VStack spacing={4}>
        <Button
          as={Link}
          to="/"
          colorScheme="green"
          size="lg"
          variant="solid"
        >
          Go to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
