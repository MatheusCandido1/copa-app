import { NativeBaseProvider, StatusBar } from 'native-base';

import { THEME } from './src/styles/theme'
import { AuthContextProvider } from './src/contexts/AuthContexts';

import { Loading } from './src/components/Loading';

import { SignIn } from './src/screens/SignIn';
import { NewPool } from './src/screens/NewPool';
import { ListPool } from './src/screens/ListPool';
import { FindPool } from './src/screens/FindPool';

export default function App() {
  //const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_500Medium, Roboto_700Bold});

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <ListPool />
      </AuthContextProvider>
    </NativeBaseProvider>
  )

}