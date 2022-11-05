import { useState } from "react";
import { Heading, Text, VStack, useToast, Box} from "native-base";
import { Keyboard } from 'react-native'

import Logo from '../../assets/logo.svg';

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { api } from "../../services/api";

export function Create() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  async function handlePoolCreate() {
    if(!title.trim()) {
      return toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">O nome do bolão é obrigatório</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
    }

    try {
      setIsLoading(true);

      await api.post('/pools', { 
        title
      });

      toast.show({
        render: () => {
          return (
            <Box bg="green.500" p={5} rounded={5}>
              <Text color="white">Bolão criado!</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })

      setTitle('')
      Keyboard.dismiss()

    } catch (error) {
      console.log(error)
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Erro ao criar bolão</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={8}
          placeholder="Qual o nome do seu bolão?"
          value={title}
          onChangeText={setTitle}
        />

        <Button 
          title="CRIAR MEU BOLÃO" 
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá {'\n'} 
          um código único que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}