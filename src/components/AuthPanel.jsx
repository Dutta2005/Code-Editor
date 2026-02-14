import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { loginUser, registerUser } from "../authApi.js";

const AuthPanel = ({ onAuthenticated }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitAuth = async () => {
    try {
      setLoading(true);
      const payload = mode === "register" ? { name, email, password } : { email, password };
      const data = mode === "register" ? await registerUser(payload) : await loginUser(payload);
      onAuthenticated(data);
      setName("");
      setEmail("");
      setPassword("");
      toast({ title: "Authenticated successfully", status: "success" });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error.response?.data?.message || "Please verify your details.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} border="1px solid" borderColor="gray.700" borderRadius="md" bg="gray.900">
      <HStack mb={4} spacing={2}>
        <Button size="sm" onClick={() => setMode("login")} colorScheme={mode === "login" ? "purple" : "gray"}>
          Login
        </Button>
        <Button
          size="sm"
          onClick={() => setMode("register")}
          colorScheme={mode === "register" ? "purple" : "gray"}
        >
          Register
        </Button>
      </HStack>

      <VStack spacing={3} align="stretch">
        {mode === "register" && (
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
        )}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="purple" onClick={submitAuth} isLoading={loading}>
          {mode === "login" ? "Login" : "Create account"}
        </Button>
        <Text fontSize="sm" color="gray.400">
          Login is required to save code, access history, and update entries.
        </Text>
      </VStack>
    </Box>
  );
};

export default AuthPanel;
