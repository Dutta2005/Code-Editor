import React from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <Box as="footer" py={12} bg="gray.900" color="gray.500" textAlign="center">
      <Text fontSize="lg" mb={4}>
        Made by{" "}
        <Link
          href="https://rajdutta.vercel.app/"
          isExternal
          color="blue.400"
          _hover={{ textDecoration: "underline" }}
        >
          Raj Dutta
        </Link>
      </Text>
      <Flex justify="center" gap={4}>
        {[
          { href: "https://github.com/Dutta2005", icon: <FaGithub /> },
          { href: "https://www.linkedin.com/in/rajdutta062005/", icon: <FaLinkedin /> },
          { href: "https://x.com/RajDutta2005", icon: <SiX /> },
          { href: "https://www.instagram.com/raj_rd_001/", icon: <FaInstagram /> },
        ].map(({ href, icon }, index) => (
          <Link
            key={index}
            href={href}
            isExternal
            _hover={{
              transform: "scale(1.2) translateZ(10px)", // Z-axis effect
              color: "blue.400", // Highlight color on hover
            }}
            transition="transform 0.2s ease, color 0.2s ease"
            cursor="pointer"
          >
            <Box fontSize="2xl">{icon}</Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
