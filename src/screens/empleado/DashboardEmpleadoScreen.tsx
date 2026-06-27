import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { obtenerEstadisticas } from '../../database/pedidosDB';
import { obtenerPlatillos } from '../../database/platillosDB';
import { Crimson, Dark, Radius, Shadow, Spacing, Typography } from '../../theme';

const DashboardEmpleadoScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [stats, setStats]           = useState({ totalPedidos: 0, pedidosPendientes: 0, totalVentas: 0, totalClientes: 0 });
  const [totalPlatillos, setTotal]  = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(() => {
    setStats(obtenerEstadisticas());
    setTotal(obtenerPlatillos().length);
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));
  const onRefresh = () => { setRefreshing(true); cargar(); setRefreshing(false); };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  const statCards = [
    { label: 'Pendientes',    val: stats.pedidosPendientes,          color: '#F59E0B', emoji: '⏳' },
    { label: 'Total pedidos', val: stats.totalPedidos,               color: Crimson.primary, emoji: '📋' },
    { label: 'Ventas',        val: `$${stats.totalVentas.toFixed(0)}`, color: '#22C55E', emoji: '💰' },
    { label: 'Clientes',      val: stats.totalClientes,              color: '#6366F1', emoji: '👥' },
    { label: 'En menú',       val: totalPlatillos,                   color: '#FB923C', emoji: '🍜' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Crimson.primary} />}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />

      {/* Greeting */}
      <View style={styles.greeting}>
        <View>
          <Text style={styles.saludo}>{saludo},</Text>
          <Text style={styles.nombre}>{usuario?.nombre?.split(' ')[0]} 👋</Text>
          <Text style={styles.fecha}>
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <View style={[styles.rolBadge, { backgroundColor: Crimson.subtle, borderColor: Crimson.primary + '55' }]}>
          <Text style={[styles.rolText, { color: Crimson.light }]}>👔 Empleado</Text>
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.sectionTitle}>RESUMEN DEL DÍA</Text>
      <View style={styles.statsGrid}>
        {statCards.map((s, i) => (
          <View key={i} style={[styles.statCard, Shadow.sm, { borderColor: s.color + '33' }]}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick nav */}
      <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>
      {[
        { emoji: '📋', titulo: 'Pedidos en curso', desc: 'Gestiona y avanza el estado de los pedidos activos', color: Crimson.primary },
        { emoji: '🍜', titulo: 'Gestión del menú', desc: 'Agrega, edita o desactiva platillos', color: '#FB923C' },
      ].map((item, i) => (
        <View key={i} style={[styles.navCard, Shadow.sm, { borderLeftColor: item.color, borderLeftWidth: 3 }]}>
          <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.navTitulo}>{item.titulo}</Text>
            <Text style={styles.navDesc}>{item.desc}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.hint}>↕ Jala para actualizar</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Dark.bg0 },
  content:     { padding: Spacing.screenX, paddingTop: Spacing.screenH, paddingBottom: 40 },
  greeting:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  saludo:      { ...Typography.body, color: Dark.textSecondary },
  nombre:      { ...Typography.h1, color: Dark.textPrimary },
  fecha:       { ...Typography.small, color: Dark.textMuted, marginTop: 4, textTransform: 'capitalize' },
  rolBadge:    { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  rolText:     { fontSize: 12, fontWeight: '700' },
  sectionTitle:{ ...Typography.label, color: Dark.textMuted, marginBottom: Spacing.md },
  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.xl },
  statCard:    { width: '47%', backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
  statEmoji:   { fontSize: 24, marginBottom: 6 },
  statVal:     { fontSize: 26, fontWeight: '900' },
  statLabel:   { ...Typography.small, color: Dark.textMuted, marginTop: 2, fontWeight: '600' },
  navCard:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Dark.border },
  navTitulo:   { ...Typography.h4, color: Dark.textPrimary },
  navDesc:     { ...Typography.small, color: Dark.textSecondary, marginTop: 3 },
  hint:        { ...Typography.small, color: Dark.textMuted, textAlign: 'center', marginTop: Spacing.lg },
});

export default DashboardEmpleadoScreen;