import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pedido, cambiarEstadoPedido, eliminarPedido, obtenerDetallePedido, obtenerTodosPedidos } from '../../database/pedidosDB';
import { Crimson, Dark, OrderStatus, Radius, Shadow, Spacing, Typography } from '../../theme';

const SIGUIENTE: Record<string, Pedido['estado']> = {
  pendiente: 'en_preparacion', en_preparacion: 'listo',
  listo: 'entregado', entregado: 'entregado', cancelado: 'cancelado',
};

const PedidosEmpleadoScreen: React.FC = () => {
  const [pedidos, setPedidos]   = useState<Pedido[]>([]);
  const [filtro, setFiltro]     = useState('todos');
  const [expandido, setExp]     = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, any[]>>({});

  const cargar = useCallback(() => setPedidos(obtenerTodosPedidos()), []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: '⏳ Pendiente' },
    { key: 'en_preparacion', label: '👨‍🍳 Prep.' },
    { key: 'listo', label: '✅ Listo' },
    { key: 'entregado', label: '🍽️ Entregado' },
  ];

  const filtrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

  const toggle = (id: number) => {
    if (expandido === id) { setExp(null); return; }
    setExp(id);
    if (!detalles[id]) setDetalles(prev => ({ ...prev, [id]: obtenerDetallePedido(id) }));
  };

  const avanzar = (id: number, estado: Pedido['estado']) => {
    const sig = SIGUIENTE[estado];
    if (!sig || sig === estado) return;
    cambiarEstadoPedido(id, sig);
    cargar();
  };

  const borrar = (id: number) => {
    Alert.alert('Eliminar pedido', '¿Seguro? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPedido(id); cargar(); } },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />
      <View style={styles.header}>
        <Text style={styles.titulo}>Pedidos</Text>
        <Text style={styles.subtitulo}>{pedidos.length} en total</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros} contentContainerStyle={{ paddingHorizontal: Spacing.screenX }}>
        {filtros.map(f => {
          const active = filtro === f.key;
          return (
            <TouchableOpacity key={f.key}
              style={[styles.filtroBtn, active && { backgroundColor: Crimson.subtle, borderColor: Crimson.primary }]}
              onPress={() => setFiltro(f.key)}>
              <Text style={[styles.filtroText, active && { color: Crimson.primary }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = OrderStatus[item.estado] ?? OrderStatus.pendiente;
          const open = expandido === item.id;
          const puedeAvanzar = item.estado !== 'entregado' && item.estado !== 'cancelado';

          return (
            <View style={[styles.card, Shadow.sm]}>
              <TouchableOpacity onPress={() => toggle(item.id!)} activeOpacity={0.8}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                    <Text style={styles.cliente}>👤 {item.nombre_cliente}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: cfg.bg, borderColor: cfg.color + '55' }]}>
                    <Text style={[styles.estadoText, { color: cfg.color }]}>{cfg.emoji} {cfg.label}</Text>
                  </View>
                </View>
                <View style={styles.cardMid}>
                  <Text style={[styles.total, { color: Crimson.primary }]}>${item.total.toFixed(2)}</Text>
                  <Text style={styles.fecha}>{item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}</Text>
                </View>
              </TouchableOpacity>

              {/* Acciones */}
              <View style={styles.acciones}>
                {puedeAvanzar && (
                  <TouchableOpacity style={[styles.btnAvanzar, { borderColor: Crimson.primary }]}
                    onPress={() => avanzar(item.id!, item.estado)}>
                    <Text style={[styles.btnAvanzarText, { color: Crimson.primary }]}>▶ Avanzar estado</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.btnDel} onPress={() => borrar(item.id!)}>
                  <Text style={styles.btnDelText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {/* Detalle expandible */}
              {open && detalles[item.id!] && (
                <View style={styles.detalle}>
                  {detalles[item.id!].map((d, i) => (
                    <View key={i} style={styles.detalleRow}>
                      <Text style={styles.detalleNombre}>{d.cantidad}× {d.nombre}</Text>
                      <Text style={styles.detalleSub}>${d.subtotal.toFixed(2)}</Text>
                    </View>
                  ))}
                  {item.notas ? <Text style={styles.notas}>📝 {item.notas}</Text> : null}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 52 }}>📭</Text>
            <Text style={styles.emptyText}>Sin pedidos en este estado</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Dark.bg0 },
  header:    { paddingHorizontal: Spacing.screenX, paddingTop: Spacing.screenH, paddingBottom: Spacing.md },
  titulo:    { ...Typography.h1, color: Dark.textPrimary },
  subtitulo: { ...Typography.body, color: Dark.textSecondary, marginTop: 2 },
  filtros:   { maxHeight: 52, marginBottom: Spacing.sm },
  filtroBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, marginRight: 8, backgroundColor: Dark.bg2, borderWidth: 1, borderColor: Dark.border },
  filtroText:{ ...Typography.small, fontWeight: '600', color: Dark.textSecondary },
  lista:     { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:      { backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Dark.border },
  cardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  pedidoId:  { ...Typography.h4, color: Dark.textPrimary },
  cliente:   { ...Typography.small, color: Dark.textSecondary, marginTop: 3 },
  estadoBadge: { borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  estadoText:{ fontSize: 12, fontWeight: '700' },
  cardMid:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  total:     { fontSize: 20, fontWeight: '900' },
  fecha:     { ...Typography.small, color: Dark.textMuted },
  acciones:  { flexDirection: 'row', gap: 8 },
  btnAvanzar:{ flex: 1, borderWidth: 1.5, borderRadius: Radius.sm, paddingVertical: 9, alignItems: 'center' },
  btnAvanzarText: { fontWeight: '700', fontSize: 13 },
  btnDel:    { backgroundColor: Dark.bg3, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 9 },
  btnDelText:{ fontSize: 16 },
  detalle:   { borderTopWidth: 1, borderTopColor: Dark.divider, marginTop: Spacing.md, paddingTop: Spacing.md },
  detalleRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detalleNombre: { ...Typography.body, color: Dark.textSecondary, flex: 1 },
  detalleSub:{ ...Typography.body, color: Dark.textMuted },
  notas:     { ...Typography.small, color: Dark.textMuted, fontStyle: 'italic', marginTop: 8 },
  empty:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { ...Typography.h4, color: Dark.textSecondary },
});

export default PedidosEmpleadoScreen;