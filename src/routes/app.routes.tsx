import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from 'native-base';

import { Create } from "../screens/Pools/Create";
import { List } from "../screens/Pools/List";
import { Show } from "../screens/Pools/Show";

import { Platform } from "react-native";

import { PlusCircle, SoccerBall } from 'phosphor-react-native'

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();

  const size = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        }
      }}
    >
      <Screen 
        name="createPool" 
        component={Create}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle size={size} color={color} />,
          tabBarLabel: 'Novo Bolão'
        }}
      />
      <Screen 
        name="listPools"
        component={List} 
        options={{
          tabBarIcon: ({ color }) => <SoccerBall size={size} color={color} />,
          tabBarLabel: 'Meus Bolões'
        }}
      />

      <Screen 
        name="showPool" 
        component={Show}
        options={{ tabBarButton: () => null}}
      />
    </Navigator>
  )
}