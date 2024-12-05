import { Box, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CodeEditor from "./components/CodeEditor.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <Router>
      <Flex direction="column" minH="100vh" bg="#0f0a19" color="gray.500">
        {/* Header */}
        <Box bg="#0f0a19" color="gray.500" px={4} py={8}>
          <Header />
        </Box>

        {/* Main Content */}
        <Box flex="1" px={4} py={8}>
          <Routes>
            <Route path="/" element={<CodeEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        {/* Footer */}
        <Footer />
      </Flex>
    </Router>
  );
}

export default App;
