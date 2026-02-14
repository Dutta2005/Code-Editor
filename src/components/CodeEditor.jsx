import {
  Box,
  Button,
  Drawer,
  DrawerBody,// Assuming you might want an icon, or just text
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { TimeIcon, CheckIcon, AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import LanguageSelector from "./LanguageSelector.jsx";
import { CODE_EXAMPLES } from "../constants.js";
import Output from "./Output.jsx";
import { fetchHistory, saveHistory, updateHistory, deleteHistoryById } from "../authApi.js";

const CodeEditor = ({ token }) => {
  const editorRef = useRef(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("Untitled snippet");
  const [history, setHistory] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });

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
      // Create a specific error message if available
      const msg = error.response?.data?.message || "Please try again later.";
      toast({
        title: "Failed to load history",
        description: msg,
        status: "error",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedHistoryId) {
      setValue(CODE_EXAMPLES[language] || "");
    }
  }, [language, selectedHistoryId]);

  useEffect(() => {
    loadHistory();
  }, [token]);

  const onSelect = (nextLanguage) => {
    setLanguage(nextLanguage);
    if (!selectedHistoryId) {
      setValue(CODE_EXAMPLES[nextLanguage] || "");
    }
    // If exploring a new language, usually we reset the history selection unless user explicitly wants to convert
    setSelectedHistoryId("");
    setTitle("Untitled snippet");
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
    onClose(); // Close sidebar on selection
  };

  const handleDelete = async (e, entryId) => {
    e.stopPropagation(); // Prevent triggering the item click
    if (!token) return;

    try {
      await deleteHistoryById(token, entryId);
      setHistory((prev) => prev.filter((entry) => entry._id !== entryId));
      // If we deleted the currently selected item, reset editor
      if (selectedHistoryId === entryId) {
        setSelectedHistoryId("");
        setTitle("Untitled snippet");
        setValue(CODE_EXAMPLES[language]);
        if (editorRef.current) editorRef.current.setValue(CODE_EXAMPLES[language]);
      }
      toast({ title: "History entry deleted", status: "success" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
      });
    }
  };

  return (
    <Box
      height={{ base: "auto", md: "calc(100vh - 100px)" }}
      overflow={{ base: "visible", md: "hidden" }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        height={{ base: "auto", md: "100%" }}
        gap={4}
      >
        {/* Editor Section */}
        <Box
          flex={{ base: "none", md: "1" }}
          display="flex"
          flexDirection="column"
          minW="0"
        >
          <Flex mb={2} gap={2} pb={1} flexWrap="wrap" alignItems="center">
            {/* History Toggle */}
            <Button size="sm" onClick={onOpen} variant="outline" colorScheme="blue">
              <TimeIcon width={5} height={5} />
              <Box as="span" display={{ base: "none", md: "inline" }} ml={1}>History</Box>
            </Button>

            {/* Language Selector */}
            <LanguageSelector language={language} onSelect={onSelect} />

            {/* Title Input */}
            <Input
              size="sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
              flex="1"
              minW="120px"
            />

            {/* Action Buttons */}
            <Button size="sm" colorScheme="purple" onClick={handleSave} isLoading={isSaving}>
              {selectedHistoryId ? <EditIcon /> : <CheckIcon />}
              <Box as="span" display={{ base: "none", md: "inline" }} ml={2}>
                {selectedHistoryId ? "Update" : "Save"}
              </Box>
            </Button>
            {selectedHistoryId && (
              <Button size="sm" colorScheme="blue" onClick={() => {
                setSelectedHistoryId("");
                setTitle("Untitled snippet");
                setValue(CODE_EXAMPLES[language]);
                if (editorRef.current) editorRef.current.setValue(CODE_EXAMPLES[language]);
              }}>
                <AddIcon />
                <Box as="span" ml={2}>New</Box>
              </Button>
            )}
          </Flex>

          <Box
            height={{ base: "50vh", md: "100%" }}
            border="1px solid"
            borderColor="gray.700"
            borderRadius="md"
            overflow="hidden"
          >
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              onMount={onMount}
              value={value}
              onChange={(nextValue) => setValue(nextValue || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          </Box>
        </Box>

        {/* Output Section */}
        <Box
          w={{ base: "100%", md: "35%" }}
          h={{ base: "auto", md: "100%" }}
          minH={{ base: "350px" }}
        >
          <Output editorRef={editorRef} language={language} />
        </Box>
      </Flex>

      {/* History Sidebar (Drawer) */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            Saved History
          </DrawerHeader>

          <DrawerBody p={0}>
            {!token ? (
              <Box p={4}>
                <Text color="gray.400">Login to view and retrieve your saved snippets.</Text>
              </Box>
            ) : historyLoading ? (
              <Box p={4}>
                <Text>Loading history...</Text>
              </Box>
            ) : history.length === 0 ? (
              <Box p={4}>
                <Text color="gray.400">No saved snippets yet.</Text>
              </Box>
            ) : (
              <VStack align="stretch" spacing={0}>
                {history.map((entry) => (
                  <Box
                    key={entry._id}
                    p={4}
                    cursor="pointer"
                    _hover={{ bg: "gray.800" }}
                    onClick={() => retrieveHistoryItem(entry)}
                    bg={selectedHistoryId === entry._id ? "gray.700" : "transparent"}
                    borderBottom="1px solid"
                    borderColor="gray.800"
                  >
                    <HStack justify="space-between">
                      <Text fontWeight="bold" noOfLines={1} flex="1">{entry.title || "Untitled"}</Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Delete history entry"
                        onClick={(e) => handleDelete(e, entry._id)}
                      />
                    </HStack>
                    <HStack justify="space-between" mt={1}>
                      <Text fontSize="xs" color="gray.400">{entry.language}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(entry.createdAt || Date.now()).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CodeEditor;
