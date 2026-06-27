import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView, StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Pedido, cambiarEstadoPedido, eliminarPedido, obtenerDetallePedido, obtenerTodosPedidos } from '../../database/pedidosDB';

const ESTADO_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  pendiente:      { color: '#feca57', emoji: '⏳', label: 'Pendiente' },
  en_preparacion: { color: '#ff9f43', emoji: '👨‍🍳', label: 'Preparando' },
  listo:          { color: '#00d4ff', emoji: '✅', label: 'Listo' },
  entregado:      { color: '#26de81', emoji: '🍽️', label: 'Entregado' },
  cancelado:      { color: '#ff6b6b', emoji: '❌', label: 'Cancelado' },
};

const SIGUIENTE: Record<string, Pedido['estado']> = {
  pendiente: 'en_preparacion',
  en_preparacion: 'listo',
  listo: 'entregado',
  entregado: 'entregado',
  cancelado: 'cancelado',
};

const PedidosEmpleadoScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [expandido, setExpandido] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, any[]>>({});

  const cargar = useCallback(() => setPedidos(obtenerTodosPedidos()), []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: '⏳' },
    { key: 'en_preparacion', label: '👨‍🍳' },
    { key: 'listo', label: '✅' },
    { key: 'entregado', label: '🍽️' },
    { key: 'cancelado', label: '❌' },
  ];

  const pedidosFiltrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

  const toggleDetalle = (id: number) => {
    if (expandido === id) { setExpandido(null); return; }
    setExpandido(id);
    if (!detalles[id]) setDetalles(prev => ({ ...prev, [id]: obtenerDetallePedido(id) }));
  };

  const avanzarEstado = (id: number, estado: Pedido['estado']) => {
    const siguiente = SIGUIENTE[estado];
    if (!siguiente || siguiente === estado) return;
    cambiarEstadoPedido(id, siguiente);
    cargar();
  };

  const handleEliminar = (id: number) => {
    Alert.alert('Eliminar pedido', '¿Seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPedido(id); cargar(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />
      <View style={styles.header}>
        <Text style={styles.titulo}>Pedidos 📋</Text>
        <Text style={styles.subtitulo}>{pedidos.length} pedidos en total</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
        {filtros.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtroBtn, filtro === f.key && styles.filtroBtnActivo]}
            onPress={() => setFiltro(f.key)}
          >
            <Text style={[styles.filtroBtnText, filtro === f.key && styles.filtroBtnTextActivo]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const config = ESTADO_CONFIG[item.estado];
          const abierto = expandido === item.id;
          const puedeAvanzar = item.estado !== 'entregado' && item.estado !== 'cancelado';

          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleDetalle(item.id!)} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                    <Text style={styles.cliente}>👤 {item.nombre_cliente}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { borderColor: config.color, backgroundColor: config.color + '22' }]}>
                    <Text style={[styles.estadoText, { color: config.color }]}>{config.emoji} {config.label}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.total}>${item.total.toFixed(2)}</Text>
                  <Text style={styles.fecha}>
                    {item.created_at ? new Date(item.created_at).toLocaleString('es-MX') : ''}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.acciones}>
                {puedeAvanzar && (
                  <TouchableOpacity
                    style={styles.btnAvanzar}
                    onPress={() => avanzarEstado(item.id!, item.estado)}
                  >
                    <Text style={styles.btnAvanzarText}>▶ Avanzar estado</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.btnEliminar} onPress={() => handleEliminar(item.id!)}>
                  <Text style={styles.btnEliminarText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {abierto && detalles[item.id!] && (
                <View style={styles.detalle}>
                  {detalles[item.id!].map((d, i) => (
                    <View key={i} style={styles.detalleRow}>
                      <Text style={styles.detalleNombre}>{d.cantidad}x {d.nombre}</Text>
                      <Text style={styles.detalleSubtotal}>${d.subtotal.toFixed(2)}</Text>
                    </View>
                  ))}
                  {item.notas ? <Text style={styles.notas}>📝 {item.notas}</Text> : null}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📭</Text>
            <Text style={styles.vacioTexto}>Sin pedidos en este estado</Text>
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
  filtros: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 46 },
  filtroBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 22,
    marginRight: 8, backgroundColor: '#16213e', borderWidth: 1, borderColor: '#2a2a6e',
  },
  filtroBtnActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  filtroBtnText: { color: '#888', fontSize: 15 },
  filtroBtnTextActivo: { color: '#00d4ff', fontWeight: '700' },
  lista: { padding: 16 },
  card: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#2a2a6e',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  pedidoId: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cliente: { color: '#aaa', fontSize: 13, marginTop: 2 },
  estadoBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  estadoText: { fontSize: 12, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: '#00d4ff', fontSize: 18, fontWeight: '800' },
  fecha: { color: '#555', fontSize: 11 },
  acciones: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' },
  btnAvanzar: {
    flex: 1, backgroundColor: '#1b1b5c', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00d4ff',
  },
  btnAvanzarText: { color: '#00d4ff', fontSize: 13, fontWeight: '700' },
  btnEliminar: { backgroundColor: '#3a1010', borderRadius: 8, padding: 8 },
  btnEliminarText: { fontSize: 16 },
  detalle: { borderTopWidth: 1, borderTopColor: '#1a1a4a', marginTop: 12, paddingTop: 12 },
  detalleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detalleNombre: { color: '#ccc', fontSize: 13, flex: 1 },
  detalleSubtotal: { color: '#aaa', fontSize: 13 },
  notas: { color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 8 },
  vacio: { alignItems: 'center', paddingTop: 80 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { color: '#aaa', fontSize: 16 },
});

export default PedidosEmpleadoScreen;