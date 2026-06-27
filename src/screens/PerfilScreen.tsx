import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { obtenerEstadisticas } from '../database/ordenesDB';
import { obtenerPlatillos } from '../database/platillosDB';

interface Stats {
  totalOrdenes: number;
  ordenesPendientes: number;
  totalVentas: number;
}

const HomeScreen: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalOrdenes: 0, ordenesPendientes: 0, totalVentas: 0 });
  const [totalPlatillos, setTotalPlatillos] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = useCallback(() => {
    const estadisticas = obtenerEstadisticas();
    setStats(estadisticas);
    const platillos = obtenerPlatillos();
    setTotalPlatillos(platillos.length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
    setRefreshing(false);
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? '¡Buenos días!' : hora < 18 ? '¡Buenas tardes!' : '¡Buenas noches!';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00d4ff" />}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.restauranteName}>Restaurante El Sabor</Text>
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.fecha}>
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      {/* Tarjetas de estadísticas */}
      <Text style={styles.seccionTitle}>Resumen del día</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: '#feca57' }]}>
          <Text style={styles.statEmoji}>⏳</Text>
          <Text style={[styles.statNumero, { color: '#feca57' }]}>{stats.ordenesPendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#00d4ff' }]}>
          <Text style={styles.statEmoji}>📋</Text>
          <Text style={[styles.statNumero, { color: '#00d4ff' }]}>{stats.totalOrdenes}</Text>
          <Text style={styles.statLabel}>Órdenes hoy</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: '#26de81' }]}>
          <Text style={styles.statEmoji}>💰</Text>
          <Text style={[styles.statNumero, { color: '#26de81' }]}>${stats.totalVentas.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Ventas</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#ff9f43' }]}>
          <Text style={styles.statEmoji}>🍜</Text>
          <Text style={[styles.statNumero, { color: '#ff9f43' }]}>{totalPlatillos}</Text>
          <Text style={styles.statLabel}>En menú</Text>
        </View>
      </View>

      {/* Acceso rápido */}
      <Text style={styles.seccionTitle}>Navegación</Text>
      <View style={styles.navCards}>
        <View style={styles.navCard}>
          <Text style={styles.navEmoji}>🍜</Text>
          <Text style={styles.navTitle}>Menú</Text>
          <Text style={styles.navDesc}>Gestiona platillos, precios y categorías</Text>
        </View>
        <View style={styles.navCard}>
          <Text style={styles.navEmoji}>📋</Text>
          <Text style={styles.navTitle}>Órdenes</Text>
          <Text style={styles.navDesc}>Crea y da seguimiento a pedidos</Text>
        </View>
        <View style={styles.navCard}>
          <Text style={styles.navEmoji}>ℹ️</Text>
          <Text style={styles.navTitle}>Info</Text>
          <Text style={styles.navDesc}>Información del restaurante</Text>
        </View>
      </View>

      <Text style={styles.footer}>Jala para actualizar el resumen ↑</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f2e',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  restauranteName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  saludo: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  fecha: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  seccionTitle: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNumero: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  navCards: {
    gap: 10,
    marginBottom: 28,
  },
  navCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  navEmoji: {
    fontSize: 28,
  },
  navTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  navDesc: {
    color: '#666',
    fontSize: 12,
    flex: 3,
  },
  footer: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;