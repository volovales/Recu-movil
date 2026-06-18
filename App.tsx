import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

import HabilidadesScreen from './src/screens/HabilidadesScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ProyectoScreen from './src/screens/ProyectoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1b1b5c',
            borderTopColor: '#16213e',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#00d4ff',
          tabBarInactiveTintColor: '#b0b0b0',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: () => <Text>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: () => <Text>👤</Text>,
          }}
        />
        <Tab.Screen
          name="Habilidades"
          component={HabilidadesScreen}
          options={{
            tabBarLabel: 'Habilidades',
            tabBarIcon: () => <Text>⭐</Text>,
          }}
        />
        <Tab.Screen
          name="Proyecto"
          component={ProyectoScreen}
          options={{
            tabBarLabel: 'Proyecto',
            tabBarIcon: () => <Text>📋</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
