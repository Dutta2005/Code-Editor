import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector.jsx";
import { CODE_EXAMPLES } from "../constants.js";
import Output from "./Output.jsx";
import { fetchHistory, saveHistory, updateHistory } from "../authApi.js";

const CodeEditor = ({ token }) => {
  const editorRef = React.useRef(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("Untitled snippet");
  const [history, setHistory] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const loadHistory = async () => {
    if (!token) {
      setHistory([]);
      return;
    }

    try {
      setHistoryLoading(true);
      const entries = await fetchHistory(token);
      setHistory(entries);
    } catch (error) {
      toast({
        title: "Failed to load history",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    setValue(CODE_EXAMPLES[language]);
  }, [language]);

  useEffect(() => {
    loadHistory();
  }, [token]);

  const onSelect = (nextLanguage) => {
    setLanguage(nextLanguage);
    setValue(CODE_EXAMPLES[nextLanguage]);
    setSelectedHistoryId("");
  };

  const handleSave = async () => {
    if (!token) {
      toast({ title: "Please login first", status: "warning" });
      return;
    }

    const code = editorRef.current?.getValue() || value;
    if (!code) {
      toast({ title: "No code to save", status: "warning" });
      return;
    }

    try {
      setIsSaving(true);
      const payload = { title, language, code };

      if (selectedHistoryId) {
        const updated = await updateHistory(token, selectedHistoryId, payload);
        setHistory((prev) => prev.map((entry) => (entry._id === updated._id ? updated : entry)));
        toast({ title: "History updated", status: "success" });
      } else {
        const created = await saveHistory(token, payload);
        setHistory((prev) => [created, ...prev]);
        setSelectedHistoryId(created._id);
        toast({ title: "Code saved to history", status: "success" });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const retrieveHistoryItem = (entry) => {
    setSelectedHistoryId(entry._id);
    setTitle(entry.title);
    setLanguage(entry.language);
    setValue(entry.code);
    if (editorRef.current) {
      editorRef.current.setValue(entry.code);
    }
  };

  const renderHistory = () => (
    <Box p={3} border="1px solid" borderColor="gray.700" borderRadius="md" bg="gray.900">
      <Text fontWeight="bold" mb={3}>
        Saved History
      </Text>
      {!token ? (
        <Text color="gray.400">Login to view and retrieve your saved snippets.</Text>
      ) : historyLoading ? (
        <Text>Loading history...</Text>
      ) : history.length === 0 ? (
        <Text color="gray.400">No saved snippets yet.</Text>
      ) : (
        <VStack align="stretch" maxH="300px" overflowY="auto">
          {history.map((entry) => (
            <Button
              key={entry._id}
              variant={selectedHistoryId === entry._id ? "solid" : "outline"}
              colorScheme="purple"
              justifyContent="space-between"
              onClick={() => retrieveHistoryItem(entry)}
            >
              <Text>{entry.title}</Text>
              <Text fontSize="xs">{entry.language}</Text>
            </Button>
          ))}
        </VStack>
      )}
    </Box>
  );

  return (
    <Box>
      {isMobile ? (
        <VStack spacing={4} align="stretch">
          <Box>
            <HStack mb={2}>
              <LanguageSelector language={language} onSelect={onSelect} />
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Snippet title" />
              <Button colorScheme="purple" onClick={handleSave} isLoading={isSaving}>
                {selectedHistoryId ? "Update" : "Save"}
              </Button>
            </HStack>
            <Editor
              height="40vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_EXAMPLES[language]}
              onMount={onMount}
              value={value}
              onChange={(nextValue) => setValue(nextValue || "")}
            />
          </Box>
          <Output editorRef={editorRef} language={language} />
          {renderHistory()}
        </VStack>
      ) : (
        <HStack spacing={4} align="stretch">
          <Box w="65%">
            <HStack mb={2}>
              <LanguageSelector language={language} onSelect={onSelect} />
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Snippet title" />
              <Button colorScheme="purple" onClick={handleSave} isLoading={isSaving}>
                {selectedHistoryId ? "Update" : "Save"}
              </Button>
            </HStack>
            <Editor
              height="100vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_EXAMPLES[language]}
              onMount={onMount}
              value={value}
              onChange={(nextValue) => setValue(nextValue || "")}
            />
          </Box>
          <VStack w="35%" align="stretch" spacing={4}>
            <Output editorRef={editorRef} language={language} />
            {renderHistory()}
          </VStack>
        </HStack>
      )}
    </Box>
  );
};

export default CodeEditor;
