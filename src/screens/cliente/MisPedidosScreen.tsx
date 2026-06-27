import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Pedido, cancelarPedido, obtenerDetallePedido, obtenerPedidosCliente } from '../../database/pedidosDB';

const ESTADO_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  pendiente:      { color: '#feca57', emoji: '⏳', label: 'Pendiente' },
  en_preparacion: { color: '#ff9f43', emoji: '👨‍🍳', label: 'En preparación' },
  listo:          { color: '#00d4ff', emoji: '✅', label: 'Listo para recoger' },
  entregado:      { color: '#26de81', emoji: '🍽️', label: 'Entregado' },
  cancelado:      { color: '#ff6b6b', emoji: '❌', label: 'Cancelado' },
};

const MisPedidosScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, any[]>>({});

  useFocusEffect(useCallback(() => {
    if (usuario?.id) setPedidos(obtenerPedidosCliente(usuario.id));
  }, [usuario]));

  const toggleDetalle = (id: number) => {
    if (expandido === id) { setExpandido(null); return; }
    setExpandido(id);
    if (!detalles[id]) {
      setDetalles(prev => ({ ...prev, [id]: obtenerDetallePedido(id) }));
    }
  };

  const handleCancelar = (id: number) => {
    Alert.alert('Cancelar pedido', '¿Seguro que deseas cancelar este pedido?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => {
          const result = cancelarPedido(id);
          if (!result.ok) { Alert.alert('Error', result.error); return; }
          setPedidos(obtenerPedidosCliente(usuario!.id!));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis pedidos 📦</Text>
        <Text style={styles.subtitulo}>{pedidos.length} pedidos realizados</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const config = ESTADO_CONFIG[item.estado] ?? ESTADO_CONFIG.pendiente;
          const abierto = expandido === item.id;
          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleDetalle(item.id!)} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                    <Text style={styles.pedidoFecha}>
                      {item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}
                    </Text>
                  </View>
                  <View style={[styles.estadoBadge, { borderColor: config.color, backgroundColor: config.color + '22' }]}>
                    <Text style={[styles.estadoText, { color: config.color }]}>
                      {config.emoji} {config.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.total}>${item.total.toFixed(2)}</Text>
                  <Text style={styles.verDetalle}>{abierto ? '▲ Ocultar' : '▼ Ver detalle'}</Text>
                </View>
              </TouchableOpacity>

              {abierto && detalles[item.id!] && (
                <View style={styles.detalle}>
                  {detalles[item.id!].map((d, i) => (
                    <View key={i} style={styles.detalleRow}>
                      <Text style={styles.detalleNombre}>{d.cantidad}x {d.nombre}</Text>
                      <Text style={styles.detalleSubtotal}>${d.subtotal.toFixed(2)}</Text>
                    </View>
                  ))}
                  {item.notas ? <Text style={styles.notas}>📝 {item.notas}</Text> : null}
                  {item.estado === 'pendiente' && (
                    <TouchableOpacity style={styles.btnCancelar} onPress={() => handleCancelar(item.id!)}>
                      <Text style={styles.btnCancelarText}>Cancelar pedido</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📭</Text>
            <Text style={styles.vacioTexto}>Aún no has hecho ningún pedido</Text>
            <Text style={styles.vacioSub}>Ve al menú y ordena algo 🍜</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  header: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14 },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#666', fontSize: 13, marginTop: 2 },
  lista: { padding: 16 },
  card: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#2a2a6e',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  pedidoId: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pedidoFecha: { color: '#666', fontSize: 12, marginTop: 2 },
  estadoBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  estadoText: { fontSize: 12, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: '#00d4ff', fontSize: 20, fontWeight: '800' },
  verDetalle: { color: '#555', fontSize: 12 },
  detalle: { borderTopWidth: 1, borderTopColor: '#1a1a4a', marginTop: 12, paddingTop: 12 },
  detalleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detalleNombre: { color: '#ccc', fontSize: 13, flex: 1 },
  detalleSubtotal: { color: '#aaa', fontSize: 13 },
  notas: { color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 8 },
  btnCancelar: {
    borderWidth: 1, borderColor: '#ff6b6b', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 12,
  },
  btnCancelarText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600' },
  vacio: { alignItems: 'center', paddingTop: 80 },
  vacioEmoji: { fontSize: 52, marginBottom: 12 },
  vacioTexto: { color: '#aaa', fontSize: 16, fontWeight: '600' },
  vacioSub: { color: '#555', fontSize: 13, marginTop: 4 },
});

export default MisPedidosScreen;