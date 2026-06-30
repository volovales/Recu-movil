import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Pedido, cambiarEstadoPedido, eliminarPedido, obtenerDetallePedido, obtenerTodosPedidos } from '../../database/pedidosDB';
import { OrderStatus, Radius, Shadow, Spacing, Typography } from '../../theme/themes';

const SIGUIENTE: Record<string, Pedido['estado']> = {
  pendiente: 'en_preparacion', en_preparacion: 'listo',
  listo: 'entregado', entregado: 'entregado', cancelado: 'cancelado',
};

const LABEL_SIGUIENTE: Record<string, string> = {
  pendiente: 'Iniciar preparación',
  en_preparacion: 'Marcar como listo',
  listo: 'Marcar entregado',
};

const PedidosEmpleadoScreen: React.FC = () => {
  const { theme, mode } = useTheme();
  const [pedidos, setPedidos]   = useState<Pedido[]>([]);
  const [filtro, setFiltro]     = useState('todos');
  const [expandido, setExp]     = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, any[]>>({});

  const cargar = useCallback(() => setPedidos(obtenerTodosPedidos()), []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const filtros = [
    { key: 'todos',          label: 'Todos' },
    { key: 'pendiente',      label: 'Pendiente' },
    { key: 'en_preparacion', label: 'Preparando' },
    { key: 'listo',          label: 'Listo' },
    { key: 'entregado',      label: 'Entregado' },
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
    Alert.alert('Eliminar pedido', '¿Seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPedido(id); cargar(); } },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg.screen }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      <View style={styles.header}>
        <Text style={[styles.titulo, { color: theme.text.primary }]}>Pedidos</Text>
        <Text style={[styles.subtitulo, { color: theme.text.secondary }]}>{pedidos.length} en total</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros} contentContainerStyle={{ paddingHorizontal: Spacing.screenX }}>
        {filtros.map(f => {
          const active = filtro === f.key;
          return (
            <TouchableOpacity key={f.key}
              style={[styles.filtroBtn, { backgroundColor: theme.bg.card, borderColor: theme.border.default },
                active && { backgroundColor: theme.accent.subtle, borderColor: theme.accent.primary }]}
              onPress={() => setFiltro(f.key)}>
              <Text style={[styles.filtroText, { color: active ? theme.accent.primary : theme.text.secondary },
                active && { fontWeight: '700' }]}>{f.label}</Text>
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
          const labelSig = LABEL_SIGUIENTE[item.estado];

          return (
            <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
              <TouchableOpacity onPress={() => toggle(item.id!)} activeOpacity={0.8}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={[styles.pedidoId, { color: theme.text.primary }]}>Pedido #{item.id}</Text>
                    <Text style={[styles.cliente, { color: theme.text.secondary }]}>{item.nombre_cliente}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: cfg.bg, borderColor: cfg.color + '55' }]}>
                    <Ionicons name={(cfg as any).icon} size={11} color={cfg.color} />
                    <Text style={[styles.estadoText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
                <View style={styles.cardMid}>
                  <Text style={[styles.total, { color: theme.accent.primary }]}>${item.total.toFixed(2)}</Text>
                  <Text style={[styles.fecha, { color: theme.text.muted }]}>
                    {item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.acciones}>
                {puedeAvanzar && labelSig && (
                  <TouchableOpacity
                    style={[styles.btnAvanzar, { borderColor: theme.accent.primary, backgroundColor: theme.accent.subtle }]}
                    onPress={() => avanzar(item.id!, item.estado)}>
                    <Ionicons name="arrow-forward-circle-outline" size={15} color={theme.accent.primary} />
                    <Text style={[styles.btnAvanzarText, { color: theme.accent.primary }]}>{labelSig}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.btnDel, { backgroundColor: theme.status.errorBg }]}
                  onPress={() => borrar(item.id!)}>
                  <Ionicons name="trash-outline" size={16} color={theme.status.error} />
                </TouchableOpacity>
              </View>

              {open && detalles[item.id!] && (
                <View style={[styles.detalle, { borderTopColor: theme.border.subtle }]}>
                  {detalles[item.id!].map((d, i) => (
                    <View key={i} style={styles.detalleRow}>
                      <Text style={[styles.detalleNombre, { color: theme.text.secondary }]}>
                        {d.cantidad}× {d.nombre}
                      </Text>
                      <Text style={[styles.detalleSub, { color: theme.text.muted }]}>
                        ${d.subtotal.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                  {item.notas ? (
                    <Text style={[styles.notas, { color: theme.text.muted }]}>{item.notas}</Text>
                  ) : null}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={theme.text.muted} />
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>Sin pedidos en este estado</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  header:        { paddingHorizontal: Spacing.screenX, paddingTop: Spacing.screenT, paddingBottom: Spacing.md },
  titulo:        { ...Typography.h1 },
  subtitulo:     { ...Typography.body, marginTop: 2 },
  filtros:       { maxHeight: 46, marginBottom: Spacing.sm },
  filtroBtn:     { height: 34, paddingHorizontal: 14, borderRadius: Radius.full, marginRight: 8, borderWidth: 1, justifyContent: 'center' },
  filtroText:    { fontSize: 12, fontWeight: '600' },
  lista:         { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:          { borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  cardTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  pedidoId:      { ...Typography.h4 },
  cliente:       { ...Typography.small, marginTop: 3 },
  estadoBadge:   { borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  estadoText:    { fontSize: 11, fontWeight: '700' },
  cardMid:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  total:         { fontSize: 20, fontWeight: '900' },
  fecha:         { ...Typography.small },
  acciones:      { flexDirection: 'row', gap: 8 },
  btnAvanzar:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 9 },
  btnAvanzarText:{ fontSize: 12, fontWeight: '700' },
  btnDel:        { borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 9, justifyContent: 'center', alignItems: 'center' },
  detalle:       { borderTopWidth: 1, marginTop: Spacing.md, paddingTop: Spacing.md },
  detalleRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detalleNombre: { ...Typography.body, flex: 1 },
  detalleSub:    { ...Typography.body },
  notas:         { ...Typography.small, fontStyle: 'italic', marginTop: 8 },
  empty:         { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:     { ...Typography.h4 },
});

export default PedidosEmpleadoScreen;