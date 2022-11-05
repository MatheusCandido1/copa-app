import { useState } from "react";
import { Heading, Text, VStack, useToast, Box} from "native-base";
import { Keyboard } from 'react-native'

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";

export function Show() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    if(!code.trim()) {
      return toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">O codígo do bolão é obrigatório</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
    }



    try {
      setIsLoading(true);

      await api.post('/pools/join', {code});
      Keyboard.dismiss()
      setCode('')

      toast.show({
        render: () => {
          return (
            <Box bg="green.500" p={5} rounded={5}>
              <Text color="white">Bem vindo ao bolão!</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })

      navigate('listPools')
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message === 'Pool not found') {
        return toast.show({
          render: () => {
            return (
              <Box bg="red.500" p={5} rounded={5}>
                <Text color="white">Bolão não encontrado</Text>
              </Box>
            )
          },
          placement: 'top',
          duration: 3000,
        })
      }

      if(error.response?.data?.message === 'Already joined') {
        return toast.show({
          render: () => {
            return (
              <Box bg="red.500" p={5} rounded={5}>
                <Text color="white">Você já está nesse bolão</Text>
              </Box>
            )
          },
          placement: 'top',
          duration: 3000,
        })
      }

      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Erro ao buscar bolão</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header showBackButton title="Buscar por código" />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontrar um bolão através de {'\n'}
          seu código único 
        </Heading>

        <Input
          mb={8}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />

        <Button title="BUSCAR BOLÃO" onPress={handleJoinPool} />
      </VStack>
    </VStack>
  );
}