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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { crearPedido, ItemCarrito } from '../../database/pedidosDB';
import { obtenerPlatillos, Platillo } from '../../database/platillosDB';
import { Dark, Radius, Shadow, Spacing, Typography, Violet } from '../../theme';

const CATEGORIAS = ['Todos', 'Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres'];
const CAT_EMOJI: Record<string, string> = {
  Todos: '🍽️', Tacos: '🌮', Entradas: '🥗', Sopas: '🍲', Bebidas: '🥤', Postres: '🍮',
};

const MenuClienteScreen: React.FC = () => {
  const { usuario } = useAuth();
  const [platillos, setPlatillos]       = useState<Platillo[]>([]);
  const [categoria, setCategoria]       = useState('Todos');
  const [carrito, setCarrito]           = useState<ItemCarrito[]>([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [notas, setNotas]               = useState('');

  useFocusEffect(useCallback(() => {
    setPlatillos(obtenerPlatillos().filter(p => p.disponible === 1));
  }, []));

  const filtrados = categoria === 'Todos' ? platillos : platillos.filter(p => p.categoria === categoria);

  const agregar = (p: Platillo) => setCarrito(prev => {
    const ex = prev.find(i => i.platillo_id === p.id);
    if (ex) return prev.map(i => i.platillo_id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
    return [...prev, { platillo_id: p.id!, nombre: p.nombre, precio: p.precio, cantidad: 1 }];
  });

  const quitar = (id: number) => setCarrito(prev => {
    const ex = prev.find(i => i.platillo_id === id);
    if (!ex) return prev;
    if (ex.cantidad === 1) return prev.filter(i => i.platillo_id !== id);
    return prev.map(i => i.platillo_id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
  });

  const cant = (id: number) => carrito.find(i => i.platillo_id === id)?.cantidad ?? 0;
  const total     = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  const confirmar = () => {
    Alert.alert('Confirmar pedido', `Total: $${total.toFixed(2)}\n\nEl pago se realiza en caja.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => {
        crearPedido(usuario!.id!, carrito, notas);
        setCarrito([]); setNotas(''); setModalCarrito(false);
        Alert.alert('¡Pedido enviado! 🎉', 'Pronto comenzaremos a prepararlo.');
      }},
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Menú</Text>
          <Text style={styles.subtitulo}>¿Qué se te antoja hoy?</Text>
        </View>
        {totalItems > 0 && (
          <TouchableOpacity style={styles.carritoBtn} onPress={() => setModalCarrito(true)}>
            <Text style={styles.carritoEmoji}>🛒</Text>
            <View style={[styles.badge, { backgroundColor: Violet.primary }]}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ paddingHorizontal: Spacing.screenX }}>
        {CATEGORIAS.map(cat => {
          const active = categoria === cat;
          return (
            <TouchableOpacity key={cat} style={[styles.catBtn, active && { backgroundColor: Violet.subtle, borderColor: Violet.primary }]}
              onPress={() => setCategoria(cat)}>
              <Text style={styles.catEmoji}>{CAT_EMOJI[cat]}</Text>
              <Text style={[styles.catText, active && { color: Violet.primary }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista */}
      <FlatList
        data={filtrados}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const c = cant(item.id!);
          return (
            <View style={[styles.card, Shadow.card]}>
              <View style={styles.cardBody}>
                <Text style={styles.platNombre}>{item.nombre}</Text>
                <Text style={styles.platDesc} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={[styles.platPrecio, { color: Violet.primary }]}>${item.precio.toFixed(2)}</Text>
              </View>
              <View style={styles.cardAction}>
                {c === 0
                  ? <TouchableOpacity style={[styles.btnAdd, { backgroundColor: Violet.primary }]} onPress={() => agregar(item)}>
                      <Text style={styles.btnAddText}>+</Text>
                    </TouchableOpacity>
                  : <View style={styles.counter}>
                      <TouchableOpacity style={[styles.cntBtn, { borderColor: Violet.primary }]} onPress={() => quitar(item.id!)}>
                        <Text style={[styles.cntText, { color: Violet.primary }]}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.cntNum}>{c}</Text>
                      <TouchableOpacity style={[styles.cntBtn, { borderColor: Violet.primary }]} onPress={() => agregar(item)}>
                        <Text style={[styles.cntText, { color: Violet.primary }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{CAT_EMOJI[categoria]}</Text>
            <Text style={styles.emptyText}>Sin platillos disponibles</Text>
          </View>
        }
      />

      {/* FAB carrito */}
      {totalItems > 0 && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: Violet.primary }, Shadow.card]} onPress={() => setModalCarrito(true)}>
          <Text style={styles.fabText}>Ver pedido ({totalItems})  •  ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* Modal carrito */}
      <Modal visible={modalCarrito} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Tu pedido</Text>
              <TouchableOpacity onPress={() => setModalCarrito(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {carrito.map(item => (
                <View key={item.platillo_id} style={styles.carritoRow}>
                  <Text style={styles.carritoNombre} numberOfLines={1}>{item.nombre}</Text>
                  <View style={styles.counter}>
                    <TouchableOpacity style={[styles.cntBtn, { borderColor: Violet.primary }]} onPress={() => quitar(item.platillo_id)}>
                      <Text style={[styles.cntText, { color: Violet.primary }]}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.cntNum}>{item.cantidad}</Text>
                    <TouchableOpacity style={[styles.cntBtn, { borderColor: Violet.primary }]} onPress={() => agregar({ ...item, id: item.platillo_id, descripcion: '', categoria: '', disponible: 1 })}>
                      <Text style={[styles.cntText, { color: Violet.primary }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.carritoSub, { color: Violet.primary }]}>${(item.precio * item.cantidad).toFixed(2)}</Text>
                </View>
              ))}

              <View style={[styles.totalRow, { borderColor: Dark.border }]}>
                <Text style={styles.totalLabel}>Total en caja</Text>
                <Text style={[styles.totalVal, { color: Violet.primary }]}>${total.toFixed(2)}</Text>
              </View>

              <Text style={styles.notasLabel}>NOTAS ESPECIALES</Text>
              <TextInput
                style={styles.notasInput} value={notas} onChangeText={setNotas}
                placeholder="Sin cebolla, sin picante…" placeholderTextColor={Dark.textMuted}
                multiline numberOfLines={2}
              />

              <TouchableOpacity style={[styles.btnConfirmar, { backgroundColor: Violet.primary }]} onPress={confirmar}>
                <Text style={styles.btnConfirmarText}>Confirmar pedido</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Dark.bg0 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screenX, paddingTop: Spacing.screenH, paddingBottom: Spacing.md },
  titulo:    { ...Typography.h1, color: Dark.textPrimary },
  subtitulo: { ...Typography.body, color: Dark.textSecondary, marginTop: 2 },
  carritoBtn:{ position: 'relative', padding: 6 },
  carritoEmoji: { fontSize: 28 },
  badge:     { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  cats:      { maxHeight: 56, marginBottom: Spacing.sm },
  catBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, marginRight: 8, backgroundColor: Dark.bg2, borderWidth: 1, borderColor: Dark.border },
  catEmoji:  { fontSize: 15 },
  catText:   { ...Typography.small, fontWeight: '600', color: Dark.textSecondary },
  lista:     { paddingHorizontal: Spacing.screenX, paddingBottom: 100 },
  card:      { flexDirection: 'row', alignItems: 'center', backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Dark.border },
  cardBody:  { flex: 1, marginRight: Spacing.md },
  platNombre:{ ...Typography.h4, color: Dark.textPrimary },
  platDesc:  { ...Typography.small, color: Dark.textSecondary, marginTop: 3, lineHeight: 17 },
  platPrecio:{ ...Typography.h3, fontWeight: '900', marginTop: 6 },
  cardAction:{ alignItems: 'center' },
  btnAdd:    { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  btnAddText:{ color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 26 },
  counter:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cntBtn:    { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  cntText:   { fontSize: 18, fontWeight: '800', lineHeight: 22 },
  cntNum:    { ...Typography.h4, color: Dark.textPrimary, minWidth: 22, textAlign: 'center' },
  empty:     { alignItems: 'center', paddingTop: 80 },
  emptyEmoji:{ fontSize: 52, marginBottom: 12 },
  emptyText: { ...Typography.h4, color: Dark.textSecondary },
  fab:       { position: 'absolute', bottom: 24, left: Spacing.screenX, right: Spacing.screenX, borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' },
  fabText:   { color: '#fff', fontWeight: '700', fontSize: 15 },
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modal:     { backgroundColor: Dark.bg1, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '88%', borderTopWidth: 1, borderColor: Dark.border },
  modalHandle:{ width: 40, height: 4, backgroundColor: Dark.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitulo:{ ...Typography.h2, color: Dark.textPrimary },
  closeBtn:  { width: 32, height: 32, borderRadius: 16, backgroundColor: Dark.bg3, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: Dark.textSecondary, fontSize: 14, fontWeight: '700' },
  carritoRow:{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Dark.divider, gap: 8 },
  carritoNombre: { ...Typography.body, color: Dark.textPrimary, flex: 1 },
  carritoSub:{ ...Typography.h4, fontWeight: '700', minWidth: 64, textAlign: 'right' },
  totalRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, borderTopWidth: 1, marginTop: Spacing.sm },
  totalLabel:{ ...Typography.body, color: Dark.textSecondary },
  totalVal:  { fontSize: 24, fontWeight: '900' },
  notasLabel:{ ...Typography.label, color: Dark.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  notasInput:{ backgroundColor: Dark.bg3, borderRadius: Radius.md, padding: Spacing.md, color: Dark.textPrimary, fontSize: 14, borderWidth: 1, borderColor: Dark.border, marginBottom: Spacing.lg },
  btnConfirmar:{ borderRadius: Radius.md, paddingVertical: 16, alignItems: 'center', marginBottom: Spacing.lg },
  btnConfirmarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

export default MenuClienteScreen;