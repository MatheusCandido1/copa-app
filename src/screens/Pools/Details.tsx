
import { useEffect, useState } from "react";
import { Share } from 'react-native';
import { VStack, useToast, Box, Text, HStack } from "native-base";
import { Header } from "../../components/Header";

import { useRoute } from '@react-navigation/native';

import { api } from '../../services/api'
import { Loading } from "../../components/Loading";
import { Guesses } from "../../components/Guesses";
import { PoolCardProps } from "../../components/PoolCard";
import { PoolHeader } from "../../components/PoolHeader";
import { EmptyMyPoolList } from "../../components/EmptyMyPoolList";
import { Option } from "../../components/Option";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [pool, setPool] = useState<PoolCardProps>({} as PoolCardProps);
  const [option, setOption] = useState<'guesses' | 'ranking'>('guesses');

  const toast = useToast();
  const route = useRoute();

  const { id } = route.params as RouteParams;

  async function getPool() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`)
      setPool(response.data)
    } catch(error) {
      console.log(error)
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Erro ao carregar detalhes do bolão</Text>
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

  useEffect(() => {
    getPool()
  }, [id])

  if(isLoading) {
    return (
      <Loading />
    );
  }

  async function handleCodeShare() {
    await Share.share({
      title: 'Código do bolão',
      message:`Olha o código do meu bolão: ${pool.code}`
    })
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header onShare={handleCodeShare} title={pool.title} showBackButton showShareButton/>
      {
        pool._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
               title="Seus palpites" 
               isSelected={option === 'guesses'}
               onPress={() => setOption('guesses')}
            />
            <Option 
              title="Ranking do grupo" 
              isSelected={option === 'ranking'} 
              onPress={() => setOption('ranking')}
            />
          </HStack>

          <Guesses poolId={pool.id} />
        </VStack>
        :
        <EmptyMyPoolList code={pool.code} />
      }
    </VStack>
  )
}