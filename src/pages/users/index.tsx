import { useCallback, useState } from 'react';
import NextLink from 'next/link'
import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";

import { getUsers, useUsers } from '../../services/hooks/useUsers';
import { queryClient } from '../../services/queryClient'

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { api } from '../../services/api';
import { GetServerSideProps } from 'next';

export default function ListUsers() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isFetching ,error } = useUsers(currentPage)

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`)

      return response.data
    }, {
      staleTime: 1000 * 60 * 10 // 10 minutes
    })
  }

  return (
    <Box>
      <Header/>

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px={['3', '3', '6']} >
        <Sidebar />

        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex
            mb='8'
            justify='space-between'
            align='center'
          >
            <Heading size='lg' fontWeight='normal'>
              Usuários
              {isFetching && !isLoading && (
                <Spinner size='sm' color='gray.500' ml='4'/>
              )}
            </Heading>

            <NextLink href='/users/create'>
              <Button 
                as='a' 
                size='sm' 
                fontSize='sm' 
                colorScheme='pink'
                leftIcon={<Icon as={RiAddLine} />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          { isLoading ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify='center'>
              <Text>Erro ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            <>
              <Table
                colorScheme='whiteAlpha'
              >
              <Thead>
                <Tr>
                  <Th px={['4', '4', '6']} color='gray.300' width='8'>
                    <Checkbox colorScheme='pink' />
                  </Th>
                  <Th>
                    Usuário
                  </Th>
                  {isWideVersion && (
                    <Th>
                      Data de cadastro
                    </Th>
                  )}
                  {isWideVersion && (
                    <Th>
                      Ações
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data.users.map(user => (
                  <Tr key={user.id}>
                    <Td px={['4', '4', '6']}>
                      <Checkbox colorScheme='pink' />
                    </Td>
                    <Td>
                      <Box>
                        <Link color='purple.400' onMouseEnter={() => handlePrefetchUser(user.id)}>
                          <Text fontWeight='bold'>{user.name}</Text>
                        </Link>
                        <Text fontSize='small' color='gray.300'>{user.email}</Text>
                      </Box>
                    </Td>
                    {isWideVersion && (
                      <Td>
                      <Text>
                        {user.createdAt}
                      </Text>
                      </Td>
                    )}
                    {isWideVersion && (
                      <Td>
                        <Button 
                          as='a' 
                          size='sm' 
                          fontSize='sm' 
                          colorScheme='pink'
                          variant={isWideVersion ? 'link' : 'solid'}
                          leftIcon={<Icon as={RiPencilLine} />}
                        >
                          Editar
                        </Button>
                      </Td>
                    )}
                </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination 
              totalCountOfRegisters={data.totalCount} 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </>
          )}
        </Box>
      </Flex>
    </Box>
  )
}