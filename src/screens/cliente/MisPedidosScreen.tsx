import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Pedido, cancelarPedido, obtenerDetallePedido, obtenerPedidosCliente } from '../../database/pedidosDB';
import { Dark, OrderStatus, Radius, Shadow, Spacing, Typography, Violet } from '../../theme';

const MisPedidosScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [pedidos, setPedidos]   = useState<Pedido[]>([]);
  const [expandido, setExp]     = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, any[]>>({});

  useFocusEffect(useCallback(() => {
    if (usuario?.id) setPedidos(obtenerPedidosCliente(usuario.id));
  }, [usuario]));

  const toggle = (id: number) => {
    if (expandido === id) { setExp(null); return; }
    setExp(id);
    if (!detalles[id]) setDetalles(prev => ({ ...prev, [id]: obtenerDetallePedido(id) }));
  };

  const cancelar = (id: number) => {
    Alert.alert('Cancelar pedido', '¿Seguro que deseas cancelar?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => {
        const r = cancelarPedido(id);
        if (!r.ok) { Alert.alert('Error', r.error); return; }
        setPedidos(obtenerPedidosCliente(usuario!.id!));
      }},
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis pedidos</Text>
        <Text style={styles.subtitulo}>{pedidos.length} pedidos realizados</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = OrderStatus[item.estado] ?? OrderStatus.pendiente;
          const open = expandido === item.id;
          return (
            <View style={[styles.card, Shadow.sm]}>
              <TouchableOpacity onPress={() => toggle(item.id!)} activeOpacity={0.8}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                    <Text style={styles.fecha}>{item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: cfg.bg, borderColor: cfg.color + '55' }]}>
                    <Text style={[styles.estadoText, { color: cfg.color }]}>{cfg.emoji} {cfg.label}</Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={[styles.total, { color: Violet.primary }]}>${item.total.toFixed(2)}</Text>
                  <Text style={styles.toggle}>{open ? '▲ Ocultar' : '▼ Ver detalle'}</Text>
                </View>
              </TouchableOpacity>

              {open && detalles[item.id!] && (
                <View style={styles.detalle}>
                  {detalles[item.id!].map((d, i) => (
                    <View key={i} style={styles.detalleRow}>
                      <Text style={styles.detalleNombre}>{d.cantidad}× {d.nombre}</Text>
                      <Text style={styles.detalleSub}>${d.subtotal.toFixed(2)}</Text>
                    </View>
                  ))}
                  {item.notas ? <Text style={styles.notas}>📝 {item.notas}</Text> : null}
                  {item.estado === 'pendiente' && (
                    <TouchableOpacity style={[styles.btnCancelar, { borderColor: '#EF4444' }]}
                      onPress={() => cancelar(item.id!)}>
                      <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 13 }}>Cancelar pedido</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 52 }}>📭</Text>
            <Text style={styles.emptyTitulo}>Sin pedidos aún</Text>
            <Text style={styles.emptyDesc}>Ve al menú y ordena algo 🍜</Text>
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
  lista:     { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:      { backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Dark.border },
  cardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  pedidoId:  { ...Typography.h4, color: Dark.textPrimary },
  fecha:     { ...Typography.small, color: Dark.textMuted, marginTop: 3 },
  estadoBadge: { borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  estadoText:{ fontSize: 12, fontWeight: '700' },
  cardBottom:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total:     { fontSize: 20, fontWeight: '900' },
  toggle:    { ...Typography.small, color: Dark.textMuted },
  detalle:   { borderTopWidth: 1, borderTopColor: Dark.divider, marginTop: Spacing.md, paddingTop: Spacing.md },
  detalleRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detalleNombre: { ...Typography.body, color: Dark.textSecondary, flex: 1 },
  detalleSub:{ ...Typography.body, color: Dark.textMuted },
  notas:     { ...Typography.small, color: Dark.textMuted, fontStyle: 'italic', marginTop: 8 },
  btnCancelar:{ borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center', marginTop: Spacing.md },
  empty:     { alignItems: 'center', paddingTop: 100, gap: 10 },
  emptyTitulo:{ ...Typography.h3, color: Dark.textSecondary },
  emptyDesc: { ...Typography.body, color: Dark.textMuted },
});

export default MisPedidosScreen;