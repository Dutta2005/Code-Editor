import { Box, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMemo, useState } from "react";
import CodeEditor from "./components/CodeEditor.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import NotFound from "./components/NotFound.jsx";

const AUTH_STORAGE_KEY = "code-editor-auth";

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: "", user: null };
  });

  const authValue = useMemo(() => auth, [auth]);

  const onAuthenticated = (payload) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    setAuth(payload);
  };

  const onLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth({ token: "", user: null });
  };

  return (
    <Router>
      <Flex direction="column" minH="100vh" bg="#0f0a19" color="gray.500">
        <Box bg="#0f0a19" color="gray.500" px={4} py={4}>
          <Header user={authValue.user} onLogout={onLogout} />
        </Box>

        <Box flex="1" px={4} pb={4}>
          <Routes>
            <Route path="/" element={<CodeEditor token={authValue.token} />} />
            <Route
              path="/login"
              element={<LoginPage user={authValue.user} onAuthenticated={onAuthenticated} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <Footer />
      </Flex>
    </Router>
  );
}

export default App;
