import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { LANGUAGE_VERSIONS } from "../constants.js";
import { useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion"; // Optional for smooth animations

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box mb={4} ml={2}>
      <Text mb={2} fontSize="lg">
        Language
      </Text>
      <Menu isLazy onOpen={onOpen} onClose={onClose}>
        <MenuButton
          as={Button}
          isActive={true}
          variant="ghost"
          rightIcon={
            <motion.div
              style={{ display: "inline-block" }}
              animate={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon />
            </motion.div>
          }
        >
          {language}
        </MenuButton>
        <MenuList bg="#110c1b">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? "blue.400" : ""}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: "blue.400",
                bg: "gray.900",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
