import { useState, useEffect } from 'react';
import { useToast, Box, Text, FlatList } from "native-base";
import { Share } from 'react-native';

import { api } from '../services/api'

import { Game, GameProps} from '../components/Game';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  
  const toast = useToast();
  
  async function getGames() {
    try {
      setIsLoading(true);
      
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)

    } catch(error) {
      console.log(error)
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Erro ao carregar os jogos</Text>
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



  async function handleGuessConfirmation(gameId: string) {
    if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Informe o placar</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
      return;
    }

    try {
      
      setIsLoading(true);
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
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

        getGames()
       
    } catch(error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" p={5} rounded={5}>
              <Text color="white">Não foi possivel enviar o palpite!</Text>
            </Box>
          )
        },
        placement: 'top',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getGames()
  }, [poolId])

  if(isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirmation(item.id)}
        /> 
      )}
      _contentContainerStyle={{pb: 10}}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
    />
  );
}
