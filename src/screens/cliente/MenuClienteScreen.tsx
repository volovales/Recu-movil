import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { crearPedido, ItemCarrito } from '../../database/pedidosDB';
import { obtenerPlatillos, Platillo } from '../../database/platillosDB';

const CATEGORIAS = ['Todos', 'Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres'];

const MenuClienteScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [categoria, setCategoria] = useState('Todos');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [notas, setNotas] = useState('');

  useFocusEffect(useCallback(() => {
    setPlatillos(obtenerPlatillos().filter(p => p.disponible === 1));
  }, []));

  const platillosFiltrados = categoria === 'Todos'
    ? platillos
    : platillos.filter(p => p.categoria === categoria);

  const agregarAlCarrito = (platillo: Platillo) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.platillo_id === platillo.id);
      if (existe) {
        return prev.map(i =>
          i.platillo_id === platillo.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, {
        platillo_id: platillo.id!,
        nombre: platillo.nombre,
        precio: platillo.precio,
        cantidad: 1,
      }];
    });
  };

  const quitarDelCarrito = (platillo_id: number) => {
    setCarrito(prev => {
      const item = prev.find(i => i.platillo_id === platillo_id);
      if (!item) return prev;
      if (item.cantidad === 1) return prev.filter(i => i.platillo_id !== platillo_id);
      return prev.map(i =>
        i.platillo_id === platillo_id ? { ...i, cantidad: i.cantidad - 1 } : i
      );
    });
  };

  const cantidadEnCarrito = (platillo_id: number) =>
    carrito.find(i => i.platillo_id === platillo_id)?.cantidad ?? 0;

  const totalCarrito = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

  const confirmarPedido = () => {
    if (carrito.length === 0) return;
    Alert.alert(
      'Confirmar pedido',
      `Total: $${totalCarrito.toFixed(2)}\n\nTu pedido será procesado y podrás seguir su estado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            crearPedido(usuario!.id!, carrito, notas);
            setCarrito([]);
            setNotas('');
            setModalCarrito(false);
            Alert.alert('¡Pedido enviado! 🎉', 'Tu pedido fue registrado. El pago se realiza en caja.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Menú 🍜</Text>
          <Text style={styles.subtitulo}>¿Qué se te antoja hoy?</Text>
        </View>
        {totalItems > 0 && (
          <TouchableOpacity style={styles.carritoBtn} onPress={() => setModalCarrito(true)}>
            <Text style={styles.carritoEmoji}>🛒</Text>
            <View style={styles.carritoBadge}>
              <Text style={styles.carritoBadgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs de categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, categoria === cat && styles.catBtnActivo]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActivo]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de platillos */}
      <FlatList
        data={platillosFiltrados}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const cant = cantidadEnCarrito(item.id!);
          return (
            <View style={styles.platilloCard}>
              <View style={styles.platilloInfo}>
                <Text style={styles.platilloNombre}>{item.nombre}</Text>
                <Text style={styles.platilloDesc} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={styles.platilloPrecio}>${item.precio.toFixed(2)}</Text>
              </View>
              <View style={styles.platilloAccion}>
                {cant === 0 ? (
                  <TouchableOpacity style={styles.btnAgregar} onPress={() => agregarAlCarrito(item)}>
                    <Text style={styles.btnAgregarText}>+ Agregar</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.cantidadRow}>
                    <TouchableOpacity style={styles.cantBtn} onPress={() => quitarDelCarrito(item.id!)}>
                      <Text style={styles.cantBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.cantNum}>{cant}</Text>
                    <TouchableOpacity style={styles.cantBtn} onPress={() => agregarAlCarrito(item)}>
                      <Text style={styles.cantBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>🍽️</Text>
            <Text style={styles.vacioTexto}>No hay platillos disponibles</Text>
          </View>
        }
      />

      {/* Botón flotante carrito */}
      {totalItems > 0 && (
        <TouchableOpacity style={styles.btnFlotante} onPress={() => setModalCarrito(true)}>
          <Text style={styles.btnFlotanteText}>
            Ver carrito ({totalItems}) — ${totalCarrito.toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal carrito */}
      <Modal visible={modalCarrito} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>🛒 Tu pedido</Text>
              <TouchableOpacity onPress={() => setModalCarrito(false)}>
                <Text style={styles.cerrar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {carrito.map(item => (
                <View key={item.platillo_id} style={styles.carritoItem}>
                  <Text style={styles.carritoNombre}>{item.nombre}</Text>
                  <View style={styles.cantidadRow}>
                    <TouchableOpacity style={styles.cantBtn} onPress={() => quitarDelCarrito(item.platillo_id)}>
                      <Text style={styles.cantBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.cantNum}>{item.cantidad}</Text>
                    <TouchableOpacity style={styles.cantBtn} onPress={() => agregarAlCarrito({ ...item, id: item.platillo_id } as any)}>
                      <Text style={styles.cantBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.carritoSubtotal}>${(item.precio * item.cantidad).toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total a pagar en caja:</Text>
                <Text style={styles.totalValor}>${totalCarrito.toFixed(2)}</Text>
              </View>

              <Text style={styles.notasLabel}>Notas especiales (opcional)</Text>
              <View style={[styles.input]}>
                <Text style={{ color: notas ? '#fff' : '#555' }}
                  onPress={() => {}}
                >{notas || 'Sin cebolla, sin picante, etc.'}</Text>
              </View>

              <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarPedido}>
                <Text style={styles.btnConfirmarText}>✅ Confirmar pedido</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14,
  },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#666', fontSize: 13, marginTop: 2 },
  carritoBtn: { position: 'relative', padding: 8 },
  carritoEmoji: { fontSize: 28 },
  carritoBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#00d4ff', borderRadius: 10,
    width: 20, height: 20, justifyContent: 'center', alignItems: 'center',
  },
  carritoBadgeText: { color: '#0f0f2e', fontSize: 11, fontWeight: '800' },
  categoriasScroll: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 46 },
  catBtn: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 22,
    marginRight: 8, backgroundColor: '#16213e', borderWidth: 1, borderColor: '#2a2a6e',
  },
  catBtnActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  catBtnText: { color: '#888', fontSize: 13, fontWeight: '600' },
  catBtnTextActivo: { color: '#00d4ff', fontWeight: '700' },
  lista: { padding: 16, paddingBottom: 100 },
  platilloCard: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a6e',
  },
  platilloInfo: { flex: 1 },
  platilloNombre: { color: '#fff', fontSize: 16, fontWeight: '700' },
  platilloDesc: { color: '#888', fontSize: 12, marginTop: 2, marginBottom: 6, lineHeight: 17 },
  platilloPrecio: { color: '#00d4ff', fontSize: 18, fontWeight: '800' },
  platilloAccion: { marginLeft: 12 },
  btnAgregar: {
    backgroundColor: '#1b1b5c', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#00d4ff',
  },
  btnAgregarText: { color: '#00d4ff', fontSize: 13, fontWeight: '700' },
  cantidadRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cantBtn: {
    backgroundColor: '#1b1b5c', borderRadius: 8,
    width: 32, height: 32, justifyContent: 'center', alignItems: 'center',
  },
  cantBtnText: { color: '#00d4ff', fontSize: 18, fontWeight: '800' },
  cantNum: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { color: '#aaa', fontSize: 16 },
  btnFlotante: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: '#00d4ff', borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  btnFlotanteText: { color: '#0f0f2e', fontSize: 15, fontWeight: '800' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#0f0f2e', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '85%', borderTopWidth: 1, borderColor: '#2a2a6e',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitulo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cerrar: { color: '#666', fontSize: 22, padding: 4 },
  carritoItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1a1a4a',
  },
  carritoNombre: { color: '#fff', fontSize: 14, flex: 1 },
  carritoSubtotal: { color: '#00d4ff', fontSize: 15, fontWeight: '700', minWidth: 70, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 16,
  },
  totalLabel: { color: '#aaa', fontSize: 15 },
  totalValor: { color: '#00d4ff', fontSize: 22, fontWeight: '900' },
  notasLabel: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#2a2a6e', marginBottom: 20,
  },
  btnConfirmar: {
    backgroundColor: '#00d4ff', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginBottom: 20,
  },
  btnConfirmarText: { color: '#0f0f2e', fontSize: 16, fontWeight: '800' },
});

export default MenuClienteScreen;