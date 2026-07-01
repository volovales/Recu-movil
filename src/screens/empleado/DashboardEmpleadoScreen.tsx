import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { obtenerEstadisticas } from '../../database/pedidosDB';
import { obtenerPlatillos } from '../../database/platillosDB';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

const DashboardEmpleadoScreen: React.FC = () => {
  const { usuario } = useAuth();
  const { theme, mode } = useTheme();
  const navigation = useNavigation<any>();
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
    { label: 'Pendientes',    val: String(stats.pedidosPendientes),          color: '#F59E0B', icon: 'time-outline' },
    { label: 'Total pedidos', val: String(stats.totalPedidos),               color: theme.accent.primary, icon: 'receipt-outline' },
    { label: 'Ventas',        val: `$${stats.totalVentas.toFixed(0)}`,       color: theme.status.success, icon: 'trending-up-outline' },
    { label: 'Clientes',      val: String(stats.totalClientes),              color: theme.secondary.primary, icon: 'people-outline' },
    { label: 'En menú',       val: String(totalPlatillos),                   color: '#FB923C', icon: 'restaurant-outline' },
  ] as const;

  const quickNav = [
    { icon: 'receipt-outline', titulo: 'Pedidos en curso',  desc: 'Gestiona y avanza el estado de pedidos activos', color: theme.accent.primary, route: 'Pedidos' },
    { icon: 'restaurant-outline', titulo: 'Gestión del menú', desc: 'Agrega, edita o desactiva platillos', color: '#FB923C', route: 'Menu' },
  ] as const;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.bg.screen }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      {/* Saludo */}
      <View style={styles.greeting}>
        <View>
          <Text style={[styles.saludo, { color: theme.text.secondary }]}>{saludo},</Text>
          <Text style={[styles.nombre, { color: theme.text.primary }]}>{usuario?.nombre?.split(' ')[0]}</Text>
          <Text style={[styles.fecha, { color: theme.text.muted }]}>
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <View style={[styles.rolBadge, { backgroundColor: theme.accent.subtle, borderColor: theme.accent.primary + '44' }]}>
          <Ionicons name="briefcase-outline" size={12} color={theme.accent.light} />
          <Text style={[styles.rolText, { color: theme.accent.light }]}>Empleado</Text>
        </View>
      </View>

      {/* Stats */}
      <Text style={[styles.sectionTitle, { color: theme.text.muted }]}>RESUMEN DEL DÍA</Text>
      <View style={styles.statsGrid}>
        {statCards.map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: theme.bg.card, borderColor: s.color + '30' }, Shadow.sm]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.color + '18' }]}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
            </View>
            <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
            <Text style={[styles.statLabel, { color: theme.text.muted }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Accesos rápidos */}
      <Text style={[styles.sectionTitle, { color: theme.text.muted }]}>ACCESOS RÁPIDOS</Text>
      {quickNav.map((item, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.75}
          onPress={() => navigation.navigate(item.route)}
          style={[styles.navCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default, borderLeftColor: item.color }, Shadow.sm]}
        >
          <View style={[styles.navIconWrap, { backgroundColor: item.color + '18' }]}>
            <Ionicons name={item.icon as any} size={20} color={item.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navTitulo, { color: theme.text.primary }]}>{item.titulo}</Text>
            <Text style={[styles.navDesc, { color: theme.text.secondary }]}>{item.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.text.muted} />
        </TouchableOpacity>
      ))}

      <Text style={[styles.hint, { color: theme.text.muted }]}>Desliza hacia abajo para actualizar</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  content:       { padding: Spacing.screenX, paddingTop: Spacing.screenT, paddingBottom: 40 },
  greeting:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  saludo:        { ...Typography.body },
  nombre:        { ...Typography.h1 },
  fecha:         { ...Typography.small, marginTop: 4, textTransform: 'capitalize' },
  rolBadge:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  rolText:       { fontSize: 11, fontWeight: '700' },
  sectionTitle:  { ...Typography.label, marginBottom: Spacing.md },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.xl },
  statCard:      { width: '47%', borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, gap: 6 },
  statIconWrap:  { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statVal:       { fontSize: 24, fontWeight: '900' },
  statLabel:     { ...Typography.small, fontWeight: '600' },
  navCard:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderLeftWidth: 3 },
  navIconWrap:   { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  navTitulo:     { ...Typography.h4 },
  navDesc:       { ...Typography.small, marginTop: 2 },
  hint:          { ...Typography.small, textAlign: 'center', marginTop: Spacing.lg },
});

export default DashboardEmpleadoScreen;