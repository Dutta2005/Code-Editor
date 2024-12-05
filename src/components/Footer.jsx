import React from 'react'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { SiX } from 'react-icons/si'

export default function Footer() {
  return (
    <Box as="footer" py={12} bg="gray.900" color="gray.500" textAlign="center">
      <Text fontSize="lg" mb={4}>
        Made by <Link href="https://rajdutta.vercel.app/" isExternal color="blue.400">Raj Dutta</Link>
      </Text>
      <Flex justify="center" gap={4}>
        <Link href="https://github.com/Dutta2005" isExternal>
          <FaGithub size={24} />
        </Link>
        <Link href="https://www.linkedin.com/in/rajdutta062005/" isExternal>
          <FaLinkedin size={24} />
        </Link>
        <Link href="https://x.com/RajDutta2005" isExternal>
          <SiX size={24} />
        </Link>
        <Link href="https://www.instagram.com/raj_rd_001/" isExternal>
          <FaInstagram size={24} />
        </Link>
      </Flex>
    </Box>
  )
}
