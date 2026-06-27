import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { initDatabase } from './src/database/database';

// Auth
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Cliente
import MenuClienteScreen from './src/screens/cliente/MenuClienteScreen';
import MiCuentaScreen from './src/screens/cliente/MiCuentaScreen';
import MisPedidosScreen from './src/screens/cliente/MisPedidosScreen';

// Empleado
import CuentaEmpleadoScreen from './src/screens/empleado/CuentaEmpleadoScreen';
import DashboardEmpleadoScreen from './src/screens/empleado/DashboardEmpleadoScreen';
import MenuEmpleadoScreen from './src/screens/empleado/MenuEmpleadoScreen';
import PedidosEmpleadoScreen from './src/screens/empleado/PedidosEmpleadoScreen';

const Tab = createBottomTabNavigator();

const TAB_OPTS = {
  tabBarStyle: { backgroundColor: '#1b1b5c', borderTopColor: '#16213e', borderTopWidth: 1 },
  tabBarActiveTintColor: '#00d4ff',
  tabBarInactiveTintColor: '#b0b0b0',
  headerShown: false,
};

const icon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

const AppNavigator = () => {
  const { usuario } = useAuth();
  const [pantalla, setPantalla] = useState<'login' | 'registro'>('login');

  if (!usuario) {
    return pantalla === 'login'
      ? <LoginScreen onIrRegistro={() => setPantalla('registro')} />
      : <RegisterScreen onIrLogin={() => setPantalla('login')} />;
  }

  if (usuario.rol === 'empleado') {
    return (
      <Tab.Navigator screenOptions={TAB_OPTS}>
        <Tab.Screen name="Inicio" component={DashboardEmpleadoScreen}
          options={{ tabBarLabel: 'Inicio', tabBarIcon: icon('🏠') }} />
        <Tab.Screen name="Pedidos" component={PedidosEmpleadoScreen}
          options={{ tabBarLabel: 'Pedidos', tabBarIcon: icon('📋') }} />
        <Tab.Screen name="Menu" component={MenuEmpleadoScreen}
          options={{ tabBarLabel: 'Menú', tabBarIcon: icon('🍜') }} />
        <Tab.Screen name="Cuenta" component={CuentaEmpleadoScreen}
          options={{ tabBarLabel: 'Mi cuenta', tabBarIcon: icon('👔') }} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={TAB_OPTS}>
      <Tab.Screen name="Menu" component={MenuClienteScreen}
        options={{ tabBarLabel: 'Menú', tabBarIcon: icon('🍜') }} />
      <Tab.Screen name="Pedidos" component={MisPedidosScreen}
        options={{ tabBarLabel: 'Mis pedidos', tabBarIcon: icon('📦') }} />
      <Tab.Screen name="Cuenta" component={MiCuentaScreen}
        options={{ tabBarLabel: 'Mi cuenta', tabBarIcon: icon('👤') }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch(e => { console.error(e); setError('Error al inicializar la base de datos.'); });
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f2e', justifyContent: 'center', alignItems: 'center' }}>
        {error
          ? <Text style={{ color: '#ff6b6b', padding: 20, textAlign: 'center' }}>{error}</Text>
          : <>
              <Text style={{ fontSize: 52, marginBottom: 16 }}>🍽️</Text>
              <ActivityIndicator size="large" color="#00d4ff" />
              <Text style={{ color: '#aaa', marginTop: 12 }}>Iniciando Restaurante El Sabor…</Text>
            </>
        }
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}