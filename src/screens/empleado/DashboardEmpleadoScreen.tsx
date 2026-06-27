import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { obtenerEstadisticas } from '../../database/pedidosDB';
import { obtenerPlatillos } from '../../database/platillosDB';

const DashboardEmpleadoScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ totalPedidos: 0, pedidosPendientes: 0, totalVentas: 0, totalClientes: 0 });
  const [totalPlatillos, setTotalPlatillos] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(() => {
    setStats(obtenerEstadisticas());
    setTotalPlatillos(obtenerPlatillos().length);
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const onRefresh = () => { setRefreshing(true); cargar(); setRefreshing(false); };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <ScrollView
      style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      <View style={styles.header}>
        <Text style={styles.saludo}>{saludo}, {usuario?.nombre?.split(' ')[0]} 👋</Text>
        <Text style={styles.fecha}>
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <View style={styles.empleadoBadge}>
          <Text style={styles.empleadoBadgeText}>👔 Empleado</Text>
        </View>
      </View>

      <Text style={styles.seccionTitulo}>Resumen del día</Text>

      <View style={styles.grid}>
        {[
          { label: 'Pendientes', valor: stats.pedidosPendientes, color: '#feca57', emoji: '⏳' },
          { label: 'Total pedidos', valor: stats.totalPedidos, color: '#00d4ff', emoji: '📋' },
          { label: 'Ventas', valor: `$${stats.totalVentas.toFixed(0)}`, color: '#26de81', emoji: '💰' },
          { label: 'Clientes', valor: stats.totalClientes, color: '#ff9f43', emoji: '👥' },
          { label: 'En menú', valor: totalPlatillos, color: '#a29bfe', emoji: '🍜' },
        ].map((item, i) => (
          <View key={i} style={[styles.statCard, { borderColor: item.color }]}>
            <Text style={styles.statEmoji}>{item.emoji}</Text>
            <Text style={[styles.statValor, { color: item.color }]}>{item.valor}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ayuda}>
        <Text style={styles.ayudaTitulo}>Navegación rápida</Text>
        {[
          { emoji: '📋', titulo: 'Pedidos', desc: 'Gestiona y avanza el estado de los pedidos' },
          { emoji: '🍜', titulo: 'Menú', desc: 'Agrega, edita o elimina platillos' },
          { emoji: '👤', titulo: 'Mi cuenta', desc: 'Tu información y cerrar sesión' },
        ].map((item, i) => (
          <View key={i} style={styles.navItem}>
            <Text style={styles.navEmoji}>{item.emoji}</Text>
            <View>
              <Text style={styles.navTitulo}>{item.titulo}</Text>
              <Text style={styles.navDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  content: { padding: 20, paddingTop: 52 },
  header: { marginBottom: 28 },
  saludo: { color: '#fff', fontSize: 24, fontWeight: '800' },
  fecha: { color: '#555', fontSize: 13, marginTop: 4, textTransform: 'capitalize' },
  empleadoBadge: {
    marginTop: 10, alignSelf: 'flex-start',
    backgroundColor: '#1a2a1a', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  empleadoBadgeText: { color: '#26de81', fontSize: 12, fontWeight: '700' },
  seccionTitulo: {
    color: '#aaa', fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    width: '47%', backgroundColor: '#16213e', borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1,
  },
  statEmoji: { fontSize: 24, marginBottom: 6 },
  statValor: { fontSize: 26, fontWeight: '900' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 2, fontWeight: '600' },
  ayuda: { backgroundColor: '#16213e', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2a2a6e' },
  ayudaTitulo: { color: '#aaa', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  navEmoji: { fontSize: 26 },
  navTitulo: { color: '#fff', fontSize: 14, fontWeight: '700' },
  navDesc: { color: '#555', fontSize: 12, marginTop: 2 },
});

export default DashboardEmpleadoScreen;