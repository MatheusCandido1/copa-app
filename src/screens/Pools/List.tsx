import { useState, useCallback } from 'react';

import { VStack, Icon, Text, Box, useToast, FlatList } from 'native-base'

import { Octicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'

import { Loading } from '../../components/Loading'
import { PoolCard, PoolCardProps } from '../../components/PoolCard';

import { EmptyPoolList } from '../../components/EmptyPoolList';

import { api } from '../../services/api'

export function List() {
  const { navigate } = useNavigation();
  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  useFocusEffect(useCallback(() => {
    getPools()
  }, []));

  async function getPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      setPools(response.data)
    } catch(error) {
      console.log(error)
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Erro ao carregar bolões</Text>
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
      <Header title="Meus Boloões" />
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          onPress={() => navigate('showPool')}
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" size="md" color="black" />}
        />
      </VStack>

      {
        isLoading ? 
        <Loading /> 
        :
        <FlatList 
        data={pools}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <PoolCard 
            data={item} 
            onPress={
              () => navigate('detailsPool', {id: item.id})
            }
          /> 
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ pb: 10 }}
        onRefresh={getPools}
        refreshing={isLoading}
        ListEmptyComponent={
          () => <EmptyPoolList />
        }
        px={5}
        />

      }
      
    </VStack>
  )
}