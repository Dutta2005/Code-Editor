import { Box, Button, Text, Textarea, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { executeCode } from "../api.js";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [input, setInput] = React.useState("");

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      return;
    }

    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode, input);
      setOutput(result.output.split("\n"));
      result.stderr ? setError(true) : setError(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column">
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={loading}
        onClick={runCode}
        alignSelf="flex-start" // Keep button left-aligned
      >
        Run Code
      </Button>

      <Box flex="1" display="flex" flexDirection="column" gap={2} minH="0">
        {/* Input Section */}
        <Text fontSize="lg" fontWeight="bold">Input</Text>
        <Textarea
          flex="1" // Take available space
          w="100%"
          color="white"
          border="1px solid"
          borderRadius={4}
          borderColor="#333"
          resize="none" // Prevent resize breaking layout
          placeholder="Enter input (If any)"
          onChange={(e) => setInput(e.target.value)}
          bg="gray.900"
        />

        {/* Output Section */}
        <Text fontSize="lg" fontWeight="bold" mt={2}>Output</Text>
        <Box
          flex="1" // Take available space
          w="100%"
          p={2}
          border="1px solid"
          borderRadius={4}
          borderColor={error ? "red.500" : "#333"}
          color={error ? "red.500" : "white"}
          bg="gray.900"
          overflowY="auto"
        >
          {output
            ? output.map((line, index) => <Text key={index}>{line}</Text>)
            : <Text color="gray.500">Click 'Run Code' to see the output</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default Output;
