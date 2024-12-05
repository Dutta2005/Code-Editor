import { Box, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector.jsx";
import { CODE_EXAMPLES } from "../constants.js";
import Output from "./Output.jsx";

const CodeEditor = () => {
  const editorRef = React.useRef(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Determine layout based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_EXAMPLES[language]);
  };

  return (
    <Box>
      {isMobile ? (
        // Stack components vertically for mobile view
        <VStack spacing={4} align="stretch">
          <Box>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              height="40vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_EXAMPLES[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </Box>
          <Output editorRef={editorRef} language={language} />
        </VStack>
      ) : (
        // Retain the horizontal layout for desktop view
        <HStack spacing={4} align="stretch">
          <Box w="50%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              height="100vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_EXAMPLES[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </Box>
          <Output editorRef={editorRef} language={language} />
        </HStack>
      )}
    </Box>
  );
};

export default CodeEditor;
