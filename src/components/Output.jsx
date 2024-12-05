import { Box, Button, Text, Textarea, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { executeCode } from "../api.js";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [input, setInput] = React.useState("");
  const isMobile = useBreakpointValue({ base: true, md: false });

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
    <Box w={isMobile ? '100%' : '50%'}>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={loading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Text mb={2} fontSize="lg">
        Input
      </Text>
      <Textarea
        height={isMobile ? "15vh" : "30vh"}
        mt={2}
        color="#fff"
        border="1px solid"
        borderRadius={4}
        borderColor="#333"
        overflow="auto"
        placeholder="Enter input (If any)"
        onChange={(e) => setInput(e.target.value)}
      ></Textarea>
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Box
        height={isMobile ? "20vh" : "50vh"}
        p={2}
        mt={4}
        border="1px solid #333"
        color={error ? "red.500" : "white"}
        borderColor={error ? "red.500" : "#333"}
        overflowY="auto"
      >
        {output
          ? output.map((line, index) => <Text key={index}>{line}</Text>)
          : "Click 'Run Code' to see the output"}
      </Box>
    </Box>
  );
};

export default Output;
