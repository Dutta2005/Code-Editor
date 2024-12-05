import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' instead of 'react-dom'
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";

// Ensure that "root" element exists in your HTML file.
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Please ensure it exists in your HTML file.");
}
