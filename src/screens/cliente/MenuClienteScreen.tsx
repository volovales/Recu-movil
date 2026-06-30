import { Ionicons } from '@expo/vector-icons';
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
import { useTheme } from '../../context/ThemeContext';
import { crearPedido, ItemCarrito } from '../../database/pedidosDB';
import { obtenerPlatillos, Platillo } from '../../database/platillosDB';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

const CATEGORIAS = ['Todos', 'Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres'];

// Iconos profesionales por categoría (Ionicons)
const CAT_ICON: Record<string, { name: any; label: string }> = {
  Todos:    { name: 'grid-outline',       label: 'Todos' },
  Tacos:    { name: 'restaurant-outline', label: 'Tacos' },
  Entradas: { name: 'leaf-outline',       label: 'Entradas' },
  Sopas:    { name: 'flame-outline',      label: 'Sopas' },
  Bebidas:  { name: 'wine-outline',       label: 'Bebidas' },
  Postres:  { name: 'ice-cream-outline',  label: 'Postres' },
};

const MenuClienteScreen: React.FC = () => {
  const { usuario } = useAuth();
  const { theme, mode } = useTheme();
  const [platillos, setPlatillos]       = useState<Platillo[]>([]);
  const [categoria, setCategoria]       = useState('Todos');
  const [carrito, setCarrito]           = useState<ItemCarrito[]>([]);
  const [modalCarrito, setModalCarrito] = useState(false);
  const [notas, setNotas]               = useState('');

  useFocusEffect(useCallback(() => {
    setPlatillos(obtenerPlatillos().filter(p => p.disponible === 1));
  }, []));

  const filtrados = categoria === 'Todos'
    ? platillos
    : platillos.filter(p => p.categoria === categoria);

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

  const cant       = (id: number) => carrito.find(i => i.platillo_id === id)?.cantidad ?? 0;
  const total      = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  const confirmar = () => {
    Alert.alert(
      'Confirmar pedido',
      `Total: $${total.toFixed(2)}\n\nEl pago se realiza en caja.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => {
          crearPedido(usuario!.id!, carrito, notas);
          setCarrito([]); setNotas(''); setModalCarrito(false);
          Alert.alert('Pedido enviado', 'En breve comenzaremos a prepararlo.');
        }},
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg.screen }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.titulo, { color: theme.text.primary }]}>Menú</Text>
          <Text style={[styles.subtitulo, { color: theme.text.secondary }]}>
            {platillos.length} platillos disponibles
          </Text>
        </View>
        {totalItems > 0 && (
          <TouchableOpacity
            style={[styles.carritoBtn, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}
            onPress={() => setModalCarrito(true)}
          >
            <Ionicons name="bag-outline" size={20} color={theme.accent.primary} />
            <View style={[styles.badge, { backgroundColor: theme.accent.primary }]}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Categorías — FIX Punto 1: altura fija, sin cambio de tamaño al seleccionar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catsScroll}
        contentContainerStyle={styles.catsContent}
      >
        {CATEGORIAS.map(cat => {
          const active = categoria === cat;
          const icon = CAT_ICON[cat];
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catBtn,
                { backgroundColor: theme.bg.card, borderColor: theme.border.default },
                active && { backgroundColor: theme.accent.subtle, borderColor: theme.accent.primary },
              ]}
              onPress={() => setCategoria(cat)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={icon.name}
                size={14}
                color={active ? theme.accent.primary : theme.text.muted}
              />
              <Text style={[
                styles.catText,
                { color: active ? theme.accent.primary : theme.text.secondary },
              ]}>
                {icon.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de platillos */}
      <FlatList
        data={filtrados}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const c = cant(item.id!);
          return (
            <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
              <View style={styles.cardBody}>
                <View style={[styles.catTag, { backgroundColor: theme.accent.subtle }]}>
                  <Text style={[styles.catTagText, { color: theme.accent.primary }]}>{item.categoria}</Text>
                </View>
                <Text style={[styles.platNombre, { color: theme.text.primary }]}>{item.nombre}</Text>
                <Text style={[styles.platDesc, { color: theme.text.secondary }]} numberOfLines={2}>
                  {item.descripcion}
                </Text>
                <Text style={[styles.platPrecio, { color: theme.accent.primary }]}>
                  ${item.precio.toFixed(2)}
                </Text>
              </View>
              <View style={styles.cardAction}>
                {c === 0 ? (
                  <TouchableOpacity
                    style={[styles.btnAdd, { backgroundColor: theme.accent.primary }]}
                    onPress={() => agregar(item)}
                  >
                    <Ionicons name="add" size={22} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.counter}>
                    <TouchableOpacity
                      style={[styles.cntBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.input }]}
                      onPress={() => quitar(item.id!)}
                    >
                      <Ionicons name="remove" size={16} color={theme.accent.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.cntNum, { color: theme.text.primary }]}>{c}</Text>
                    <TouchableOpacity
                      style={[styles.cntBtn, { borderColor: theme.accent.primary, backgroundColor: theme.accent.subtle }]}
                      onPress={() => agregar(item)}
                    >
                      <Ionicons name="add" size={16} color={theme.accent.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="restaurant-outline" size={52} color={theme.text.muted} />
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
              Sin platillos disponibles
            </Text>
          </View>
        }
      />

      {/* FAB carrito */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.accent.primary }, Shadow.card]}
          onPress={() => setModalCarrito(true)}
        >
          <Ionicons name="bag-check-outline" size={18} color="#fff" />
          <Text style={styles.fabText}>
            Ver pedido ({totalItems})  ·  ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal carrito */}
      <Modal visible={modalCarrito} animationType="slide" transparent>
        <View style={[styles.overlay, { backgroundColor: theme.bg.overlay }]}>
          <View style={[styles.modal, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border.default }]} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: theme.text.primary }]}>Tu pedido</Text>
              <TouchableOpacity
                onPress={() => setModalCarrito(false)}
                style={[styles.closeBtn, { backgroundColor: theme.bg.input }]}
              >
                <Ionicons name="close" size={18} color={theme.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {carrito.map(item => (
                <View
                  key={item.platillo_id}
                  style={[styles.carritoRow, { borderBottomColor: theme.border.subtle }]}
                >
                  <Text style={[styles.carritoNombre, { color: theme.text.primary }]} numberOfLines={1}>
                    {item.nombre}
                  </Text>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      style={[styles.cntBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.input }]}
                      onPress={() => quitar(item.platillo_id)}
                    >
                      <Ionicons name="remove" size={14} color={theme.accent.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.cntNum, { color: theme.text.primary }]}>{item.cantidad}</Text>
                    <TouchableOpacity
                      style={[styles.cntBtn, { borderColor: theme.accent.primary, backgroundColor: theme.accent.subtle }]}
                      onPress={() => agregar({ ...item, id: item.platillo_id, descripcion: '', categoria: '', disponible: 1 })}
                    >
                      <Ionicons name="add" size={14} color={theme.accent.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.carritoSub, { color: theme.accent.primary }]}>
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </Text>
                </View>
              ))}

              <View style={[styles.totalRow, { borderColor: theme.border.default }]}>
                <Text style={[styles.totalLabel, { color: theme.text.secondary }]}>Total en caja</Text>
                <Text style={[styles.totalVal, { color: theme.accent.primary }]}>${total.toFixed(2)}</Text>
              </View>

              <Text style={[styles.notasLabel, { color: theme.text.muted }]}>NOTAS ESPECIALES</Text>
              <TextInput
                style={[styles.notasInput, {
                  backgroundColor: theme.bg.input,
                  borderColor: theme.border.default,
                  color: theme.text.primary,
                }]}
                value={notas}
                onChangeText={setNotas}
                placeholder="Sin cebolla, sin picante…"
                placeholderTextColor={theme.text.muted}
                multiline
                numberOfLines={2}
              />

              <TouchableOpacity
                style={[styles.btnConfirmar, { backgroundColor: theme.accent.primary }]}
                onPress={confirmar}
              >
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
  screen:           { flex: 1 },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screenX, paddingTop: Spacing.screenT, paddingBottom: Spacing.md },
  titulo:           { ...Typography.h1 },
  subtitulo:        { ...Typography.body, marginTop: 2 },
  carritoBtn:       { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  badge:            { position: 'absolute', top: -2, right: -2, width: 17, height: 17, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  badgeText:        { color: '#fff', fontSize: 9, fontWeight: '800' },

  // FIX Punto 1: altura fija para TODOS los botones, sin excepción
  catsScroll:       { maxHeight: 52, marginBottom: Spacing.sm },
  catsContent:      { paddingHorizontal: Spacing.screenX, alignItems: 'center' },
  catBtn:           {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      // Dimensiones FIJAS — no cambian al seleccionar
                      height: 34,
                      paddingHorizontal: 12,
                      borderRadius: Radius.full,
                      marginRight: 8,
                      borderWidth: 1,
                    },
  catText:          { fontSize: 12, fontWeight: '600' },

  lista:            { paddingHorizontal: Spacing.screenX, paddingBottom: 100 },
  card:             { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  cardBody:         { flex: 1, marginRight: Spacing.md },
  catTag:           { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 5 },
  catTagText:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  platNombre:       { ...Typography.h4 },
  platDesc:         { ...Typography.small, marginTop: 3, lineHeight: 17 },
  platPrecio:       { fontSize: 18, fontWeight: '900', marginTop: 6 },
  cardAction:       { alignItems: 'center' },
  btnAdd:           { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  counter:          { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cntBtn:           { width: 30, height: 30, borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  cntNum:           { ...Typography.h4, minWidth: 20, textAlign: 'center' },
  empty:            { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:        { ...Typography.h4, marginTop: 4 },
  fab:              { position: 'absolute', bottom: 24, left: Spacing.screenX, right: Spacing.screenX, borderRadius: Radius.lg, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fabText:          { color: '#fff', fontWeight: '700', fontSize: 14 },
  overlay:          { flex: 1, justifyContent: 'flex-end' },
  modal:            { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '88%', borderTopWidth: 1 },
  modalHandle:      { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitulo:      { ...Typography.h2 },
  closeBtn:         { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  carritoRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 8 },
  carritoNombre:    { ...Typography.body, flex: 1 },
  carritoSub:       { ...Typography.h4, fontWeight: '700', minWidth: 64, textAlign: 'right' },
  totalRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, borderTopWidth: 1, marginTop: Spacing.sm },
  totalLabel:       { ...Typography.body },
  totalVal:         { fontSize: 22, fontWeight: '900' },
  notasLabel:       { ...Typography.label, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  notasInput:       { borderRadius: Radius.md, padding: Spacing.md, fontSize: 14, borderWidth: 1, marginBottom: Spacing.lg },
  btnConfirmar:     { borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center', marginBottom: Spacing.lg },
  btnConfirmarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

export default MenuClienteScreen;