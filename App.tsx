import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // FIX Error 4
import TabBar from './src/components/TabBar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
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

// FIX Error 3 + 5: sincroniza el tema al hacer login/logout
const RoleThemeSync = ({ children }: { children: React.ReactNode }) => {
  const { usuario, esEmpleado } = useAuth();
  const { initTheme, resetTheme } = useTheme();

  useEffect(() => {
    if (usuario) {
      // Carga el rol y el tema guardado de este usuario específico
      const role = esEmpleado ? 'empleado' : 'cliente';
      const mode = (usuario.tema ?? 'dark') as 'dark' | 'light';
      initTheme(role, mode);  // FIX Error 5: tema por usuario, no global
    } else {
      resetTheme();  // FIX Error 5: al logout vuelve a defaults
    }
  }, [usuario]);

  return <>{children}</>;
};

const AppNavigator = () => {
  const { usuario, esEmpleado } = useAuth();
  const [pantalla, setPantalla] = useState<'login' | 'registro'>('login');

  if (!usuario) {
    return pantalla === 'login'
      ? <LoginScreen onIrRegistro={() => setPantalla('registro')} />
      : <RegisterScreen onIrLogin={() => setPantalla('login')} />;
  }

  if (esEmpleado) {
    return (
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Inicio"  component={DashboardEmpleadoScreen} options={{ tabBarLabel: 'Inicio' }} />
        <Tab.Screen name="Pedidos" component={PedidosEmpleadoScreen}   options={{ tabBarLabel: 'Pedidos' }} />
        <Tab.Screen name="Menu"    component={MenuEmpleadoScreen}       options={{ tabBarLabel: 'Menu' }} />
        <Tab.Screen name="Cuenta"  component={CuentaEmpleadoScreen}     options={{ tabBarLabel: 'Cuenta' }} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Menu"      component={MenuClienteScreen}  options={{ tabBarLabel: 'Menu' }} />
      <Tab.Screen name="Pedidos"   component={MisPedidosScreen}   options={{ tabBarLabel: 'Mis pedidos' }} />
      <Tab.Screen name="MiCuenta"  component={MiCuentaScreen}     options={{ tabBarLabel: 'Mi cuenta' }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch(e => { console.error(e); setError('Error al inicializar la base de datos.'); });
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080A12', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        {error
          ? <Text style={{ color: '#EF4444', padding: 20, textAlign: 'center' }}>{error}</Text>
          : <>
              <Text style={{ fontSize: 54 }}>🍽️</Text>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={{ color: '#8B93C4', fontSize: 14 }}>Iniciando El Sabor…</Text>
            </>
        }
      </View>
    );
  }

  return (
    // FIX Error 4: SafeAreaProvider envuelve todo para que useSafeAreaInsets funcione
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <RoleThemeSync>
              <AppNavigator />
            </RoleThemeSync>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}