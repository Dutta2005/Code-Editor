import { Box, Heading } from "@chakra-ui/react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthPanel from "./AuthPanel.jsx";

const LoginPage = ({ user, onAuthenticated }) => {
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuthenticated = (payload) => {
    onAuthenticated(payload);
    navigate("/");
  };

  return (
    <Box maxW="520px" mx="auto">
      <Heading size="md" mb={4} color="white">
        Login to save and manage your code history
      </Heading>
      <AuthPanel onAuthenticated={handleAuthenticated} />
    </Box>
  );
};

export default LoginPage;
