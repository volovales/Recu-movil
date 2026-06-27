import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import { Platillo, actualizarPlatillo, crearPlatillo, eliminarPlatillo, obtenerPlatillos } from '../../database/platillosDB';
import { Crimson, Dark, Radius, Shadow, Spacing, Typography } from '../../theme';

const CATEGORIAS = ['Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres', 'Otros'];
const CAT_EMOJI: Record<string, string> = {
  Tacos: '🌮', Entradas: '🥗', Sopas: '🍲', Bebidas: '🥤', Postres: '🍮', Otros: '🍽️',
};

interface Errs { nombre?: string; descripcion?: string; precio?: string; }

const MenuEmpleadoScreen: React.FC = () => {
  const [platillos, setPlatillos]   = useState<Platillo[]>([]);
  const [catActiva, setCatActiva]   = useState('Tacos');
  const [modal, setModal]           = useState(false);
  const [editando, setEditando]     = useState<Platillo | null>(null);
  const [nombre, setNombre]         = useState('');
  const [descripcion, setDesc]      = useState('');
  const [precio, setPrecio]         = useState('');
  const [categoria, setCategoria]   = useState('Tacos');
  const [disponible, setDisponible] = useState(true);
  const [errs, setErrs]             = useState<Errs>({});

  const cargar = useCallback(() => setPlatillos(obtenerPlatillos()), []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const filtrados = platillos.filter(p => p.categoria === catActiva);

  const abrirNuevo = () => {
    setEditando(null); setNombre(''); setDesc(''); setPrecio('');
    setCategoria(catActiva); setDisponible(true); setErrs({}); setModal(true);
  };

  const abrirEditar = (p: Platillo) => {
    setEditando(p); setNombre(p.nombre); setDesc(p.descripcion);
    setPrecio(String(p.precio)); setCategoria(p.categoria);
    setDisponible(p.disponible === 1); setErrs({}); setModal(true);
  };

  const validar = () => {
    const e: Errs = {};
    if (!nombre.trim() || nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres';
    if (!descripcion.trim()) e.descripcion = 'Descripción obligatoria';
    const p = parseFloat(precio);
    if (!precio.trim()) e.precio = 'Precio obligatorio';
    else if (isNaN(p) || p <= 0) e.precio = 'Precio inválido';
    setErrs(e); return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;
    const datos = { nombre: nombre.trim(), descripcion: descripcion.trim(), precio: parseFloat(precio), categoria, disponible: disponible ? 1 : 0 };
    editando?.id ? actualizarPlatillo(editando.id, datos) : crearPlatillo(datos);
    setModal(false); cargar();
  };

  const eliminar = (id: number, nombre: string) => {
    Alert.alert('Eliminar', `¿Eliminar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPlatillo(id); cargar(); } },
    ]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />

      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Menú</Text>
          <Text style={styles.subtitulo}>{platillos.length} platillos registrados</Text>
        </View>
        <TouchableOpacity style={[styles.btnAdd, { backgroundColor: Crimson.primary }]} onPress={abrirNuevo}>
          <Text style={styles.btnAddText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={{ paddingHorizontal: Spacing.screenX }}>
        {CATEGORIAS.map(cat => {
          const cnt = platillos.filter(p => p.categoria === cat).length;
          const active = catActiva === cat;
          return (
            <TouchableOpacity key={cat}
              style={[styles.tab, active && { backgroundColor: Crimson.subtle, borderColor: Crimson.primary }]}
              onPress={() => setCatActiva(cat)}>
              <Text style={styles.tabEmoji}>{CAT_EMOJI[cat]}</Text>
              <Text style={[styles.tabText, active && { color: Crimson.primary }]}>{cat}</Text>
              {cnt > 0 && <View style={[styles.tabCnt, { backgroundColor: active ? Crimson.primary : Dark.bg3 }]}>
                <Text style={[styles.tabCntText, { color: active ? '#fff' : Dark.textMuted }]}>{cnt}</Text>
              </View>}
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
        renderItem={({ item }) => (
          <View style={[styles.card, Shadow.sm]}>
            <View style={styles.cardTop}>
              <View style={styles.cardInfo}>
                <Text style={styles.platNombre}>{item.nombre}</Text>
                <Text style={styles.platDesc} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={[styles.platPrecio, { color: Crimson.primary }]}>${item.precio.toFixed(2)}</Text>
              </View>
              <View style={[styles.dispTag, { backgroundColor: item.disponible ? '#22C55E18' : '#EF444418' }]}>
                <Text style={[styles.dispText, { color: item.disponible ? '#22C55E' : '#EF4444' }]}>
                  {item.disponible ? '● Activo' : '● Inactivo'}
                </Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.btnAction, { borderColor: Dark.border }]} onPress={() => abrirEditar(item)}>
                <Text style={styles.btnActionText}>✏️  Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAction, { borderColor: Crimson.primary + '44' }]}
                onPress={() => item.id && eliminar(item.id, item.nombre)}>
                <Text style={[styles.btnActionText, { color: Crimson.light }]}>🗑️  Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 52 }}>{CAT_EMOJI[catActiva]}</Text>
            <Text style={styles.emptyText}>Sin platillos en {catActiva}</Text>
            <TouchableOpacity style={[styles.btnEmptyAdd, { borderColor: Crimson.primary }]} onPress={abrirNuevo}>
              <Text style={[styles.btnEmptyAddText, { color: Crimson.primary }]}>+ Agregar el primero</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.handle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{editando ? 'Editar platillo' : 'Nuevo platillo'}</Text>
              <TouchableOpacity onPress={() => setModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputField label="Nombre" value={nombre} onChangeText={setNombre}
                placeholder="Ej. Tacos al Pastor" error={errs.nombre} required accentColor={Crimson.primary} />
              <InputField label="Descripción" value={descripcion} onChangeText={setDesc}
                placeholder="Ingredientes o descripción" error={errs.descripcion}
                multiline numberOfLines={2} required accentColor={Crimson.primary} />
              <InputField label="Precio (MXN)" value={precio} onChangeText={setPrecio}
                placeholder="0.00" keyboardType="decimal-pad" error={errs.precio} required accentColor={Crimson.primary} />

              <Text style={styles.catLabel}>CATEGORÍA</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                {CATEGORIAS.map(cat => (
                  <TouchableOpacity key={cat}
                    style={[styles.catChip, categoria === cat && { backgroundColor: Crimson.subtle, borderColor: Crimson.primary }]}
                    onPress={() => setCategoria(cat)}>
                    <Text style={styles.catChipEmoji}>{CAT_EMOJI[cat]}</Text>
                    <Text style={[styles.catChipText, categoria === cat && { color: Crimson.primary }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Disponible en menú</Text>
                <Switch value={disponible} onValueChange={setDisponible}
                  trackColor={{ false: Dark.bg3, true: Crimson.dark }}
                  thumbColor={disponible ? Crimson.primary : Dark.textMuted} />
              </View>

              <Button label={editando ? 'Guardar cambios' : 'Agregar al menú'}
                onPress={guardar} color={Crimson.primary} style={{ marginBottom: Spacing.xl }} />
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
  btnAdd:    { borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10 },
  btnAddText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
  tabs:      { maxHeight: 56, marginBottom: Spacing.sm },
  tab:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, marginRight: 8, backgroundColor: Dark.bg2, borderWidth: 1, borderColor: Dark.border },
  tabEmoji:  { fontSize: 15 },
  tabText:   { ...Typography.small, fontWeight: '600', color: Dark.textSecondary },
  tabCnt:    { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  tabCntText:{ fontSize: 10, fontWeight: '800' },
  lista:     { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:      { backgroundColor: Dark.bg2, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Dark.border },
  cardTop:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  cardInfo:  { flex: 1, marginRight: Spacing.sm },
  platNombre:{ ...Typography.h4, color: Dark.textPrimary },
  platDesc:  { ...Typography.small, color: Dark.textSecondary, marginTop: 3, lineHeight: 17 },
  platPrecio:{ fontSize: 20, fontWeight: '900', marginTop: 6 },
  dispTag:   { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  dispText:  { fontSize: 11, fontWeight: '700' },
  cardActions:{ flexDirection: 'row', gap: 8 },
  btnAction: { flex: 1, borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center' },
  btnActionText: { ...Typography.small, color: Dark.textSecondary, fontWeight: '600' },
  empty:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { ...Typography.h4, color: Dark.textSecondary },
  btnEmptyAdd:{ borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, paddingVertical: 10 },
  btnEmptyAddText: { fontWeight: '700' },
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalBox:  { backgroundColor: Dark.bg1, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '92%', borderTopWidth: 1, borderColor: Dark.border },
  handle:    { width: 40, height: 4, backgroundColor: Dark.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitulo:{ ...Typography.h2, color: Dark.textPrimary },
  closeBtn:  { width: 32, height: 32, borderRadius: 16, backgroundColor: Dark.bg3, justifyContent: 'center', alignItems: 'center' },
  closeText: { color: Dark.textSecondary, fontSize: 14, fontWeight: '700' },
  catLabel:  { ...Typography.label, color: Dark.textMuted, marginBottom: Spacing.sm },
  catChip:   { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, marginRight: 8, backgroundColor: Dark.bg3, borderWidth: 1, borderColor: Dark.border },
  catChipEmoji: { fontSize: 15 },
  catChipText:  { ...Typography.small, fontWeight: '600', color: Dark.textSecondary },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Dark.bg3, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Dark.border, marginBottom: Spacing.md },
  switchLabel:{ ...Typography.body, color: Dark.textSecondary },
});

export default MenuEmpleadoScreen;