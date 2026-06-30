import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Pedido, cancelarPedido, obtenerDetallePedido, obtenerPedidosCliente } from '../../database/pedidosDB';
import { OrderStatus, Radius, Shadow, Spacing, Typography } from '../../theme/themes';

// Íconos de estado (sin emojis)
const ESTADO_ICON: Record<string, any> = {
  pendiente:      'time-outline',
  en_preparacion: 'flame-outline',
  listo:          'checkmark-circle-outline',
  entregado:      'bag-check-outline',
  cancelado:      'close-circle-outline',
};

const MisPedidosScreen: React.FC = () => {
  const { usuario } = useAuth();
  const { theme, mode } = useTheme();
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
    Alert.alert('Cancelar pedido', '¿Seguro que deseas cancelar este pedido?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => {
        const r = cancelarPedido(id);
        if (!r.ok) { Alert.alert('Error', r.error); return; }
        setPedidos(obtenerPedidosCliente(usuario!.id!));
      }},
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg.screen }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      <View style={styles.header}>
        <Text style={[styles.titulo, { color: theme.text.primary }]}>Mis pedidos</Text>
        <Text style={[styles.subtitulo, { color: theme.text.secondary }]}>
          {pedidos.length} {pedidos.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
        </Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg  = OrderStatus[item.estado] ?? OrderStatus.pendiente;
          const icon = ESTADO_ICON[item.estado] ?? 'help-circle-outline';
          const open = expandido === item.id;

          return (
            <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
              <TouchableOpacity onPress={() => toggle(item.id!)} activeOpacity={0.8}>
                {/* Cabecera */}
                <View style={styles.cardTop}>
                  <View>
                    <Text style={[styles.pedidoId, { color: theme.text.primary }]}>
                      Pedido #{item.id}
                    </Text>
                    <Text style={[styles.fecha, { color: theme.text.muted }]}>
                      {item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}
                    </Text>
                  </View>
                  {/* Badge de estado con ícono */}
                  <View style={[styles.estadoBadge, { backgroundColor: cfg.bg, borderColor: cfg.color + '55' }]}>
                    <Ionicons name={icon} size={11} color={cfg.color} />
                    <Text style={[styles.estadoText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>

                {/* Pie de tarjeta */}
                <View style={styles.cardBottom}>
                  <Text style={[styles.total, { color: theme.accent.primary }]}>
                    ${item.total.toFixed(2)}
                  </Text>
                  <View style={styles.toggleBtn}>
                    <Text style={[styles.toggleText, { color: theme.text.muted }]}>
                      {open ? 'Ocultar' : 'Ver detalle'}
                    </Text>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={theme.text.muted}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Detalle expandible */}
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
                    <Text style={[styles.notas, { color: theme.text.muted }]}>
                      {item.notas}
                    </Text>
                  ) : null}
                  {item.estado === 'pendiente' && (
                    <TouchableOpacity
                      style={[styles.btnCancelar, { borderColor: theme.status.error }]}
                      onPress={() => cancelar(item.id!)}
                    >
                      <Ionicons name="close-circle-outline" size={15} color={theme.status.error} />
                      <Text style={[styles.btnCancelarText, { color: theme.status.error }]}>
                        Cancelar pedido
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={52} color={theme.text.muted} />
            <Text style={[styles.emptyTitulo, { color: theme.text.secondary }]}>
              Sin pedidos aún
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.text.muted }]}>
              Visita el menú y realiza tu primer pedido
            </Text>
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
  lista:         { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:          { borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  cardTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  pedidoId:      { ...Typography.h4 },
  fecha:         { ...Typography.small, marginTop: 3 },
  estadoBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  estadoText:    { fontSize: 11, fontWeight: '700' },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total:         { fontSize: 20, fontWeight: '900' },
  toggleBtn:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  toggleText:    { ...Typography.small },
  detalle:       { borderTopWidth: 1, marginTop: Spacing.md, paddingTop: Spacing.md },
  detalleRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  detalleNombre: { ...Typography.body, flex: 1 },
  detalleSub:    { ...Typography.body },
  notas:         { ...Typography.small, fontStyle: 'italic', marginTop: 8 },
  btnCancelar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 9, marginTop: Spacing.md },
  btnCancelarText:{ fontSize: 13, fontWeight: '600' },
  empty:         { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyTitulo:   { ...Typography.h3 },
  emptyDesc:     { ...Typography.body, textAlign: 'center' },
});

export default MisPedidosScreen;