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
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import { useTheme } from '../../context/ThemeContext';
import { Platillo, actualizarPlatillo, crearPlatillo, eliminarPlatillo, obtenerPlatillos } from '../../database/platillosDB';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

const CATEGORIAS = ['Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres', 'Otros'];
const CAT_ICON: Record<string, any> = {
  Tacos: 'restaurant-outline', Entradas: 'leaf-outline', Sopas: 'flame-outline',
  Bebidas: 'wine-outline', Postres: 'ice-cream-outline', Otros: 'ellipsis-horizontal-outline',
};

interface Errs { nombre?: string; descripcion?: string; precio?: string; }

const MenuEmpleadoScreen: React.FC = () => {
  const { theme, mode } = useTheme();
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

  const eliminar = (id: number, nom: string) => {
    Alert.alert('Eliminar platillo', `¿Eliminar "${nom}" del menú?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPlatillo(id); cargar(); } },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg.screen }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.titulo, { color: theme.text.primary }]}>Menú</Text>
          <Text style={[styles.subtitulo, { color: theme.text.secondary }]}>{platillos.length} platillos registrados</Text>
        </View>
        <TouchableOpacity style={[styles.btnAdd, { backgroundColor: theme.accent.primary }]} onPress={abrirNuevo}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.btnAddText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs categoría — altura fija igual que en MenuCliente */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={{ paddingHorizontal: Spacing.screenX }}>
        {CATEGORIAS.map(cat => {
          const cnt = platillos.filter(p => p.categoria === cat).length;
          const active = catActiva === cat;
          return (
            <TouchableOpacity key={cat}
              style={[styles.tab, { backgroundColor: theme.bg.card, borderColor: theme.border.default },
                active && { backgroundColor: theme.accent.subtle, borderColor: theme.accent.primary }]}
              onPress={() => setCatActiva(cat)}>
              <Ionicons name={CAT_ICON[cat]} size={13} color={active ? theme.accent.primary : theme.text.muted} />
              <Text style={[styles.tabText, { color: active ? theme.accent.primary : theme.text.secondary }, active && { fontWeight: '700' }]}>{cat}</Text>
              {cnt > 0 && (
                <View style={[styles.tabCnt, { backgroundColor: active ? theme.accent.primary : theme.bg.input }]}>
                  <Text style={[styles.tabCntText, { color: active ? '#fff' : theme.text.muted }]}>{cnt}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
            <View style={styles.cardTop}>
              <View style={styles.cardInfo}>
                <Text style={[styles.platNombre, { color: theme.text.primary }]}>{item.nombre}</Text>
                <Text style={[styles.platDesc, { color: theme.text.secondary }]} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={[styles.platPrecio, { color: theme.accent.primary }]}>${item.precio.toFixed(2)}</Text>
              </View>
              <View style={[styles.dispTag, { backgroundColor: item.disponible ? theme.status.successBg : theme.status.errorBg }]}>
                <View style={[styles.dispDot, { backgroundColor: item.disponible ? theme.status.success : theme.status.error }]} />
                <Text style={[styles.dispText, { color: item.disponible ? theme.status.success : theme.status.error }]}>
                  {item.disponible ? 'Activo' : 'Inactivo'}
                </Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.btnAction, { borderColor: theme.border.default }]} onPress={() => abrirEditar(item)}>
                <Ionicons name="pencil-outline" size={14} color={theme.text.secondary} />
                <Text style={[styles.btnActionText, { color: theme.text.secondary }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnAction, { borderColor: theme.status.error + '44' }]}
                onPress={() => item.id && eliminar(item.id, item.nombre)}>
                <Ionicons name="trash-outline" size={14} color={theme.status.error} />
                <Text style={[styles.btnActionText, { color: theme.status.error }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="restaurant-outline" size={48} color={theme.text.muted} />
            <Text style={[styles.emptyText, { color: theme.text.secondary }]}>Sin platillos en {catActiva}</Text>
            <TouchableOpacity style={[styles.btnEmptyAdd, { borderColor: theme.accent.primary }]} onPress={abrirNuevo}>
              <Text style={[{ color: theme.accent.primary, fontWeight: '700' }]}>Agregar el primero</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={[styles.overlay, { backgroundColor: theme.bg.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}>
            <View style={[styles.handle, { backgroundColor: theme.border.default }]} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: theme.text.primary }]}>
                {editando ? 'Editar platillo' : 'Nuevo platillo'}
              </Text>
              <TouchableOpacity onPress={() => setModal(false)} style={[styles.closeBtn, { backgroundColor: theme.bg.input }]}>
                <Ionicons name="close" size={18} color={theme.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputField label="Nombre" value={nombre} onChangeText={setNombre}
                placeholder="Ej. Tacos al Pastor" error={errs.nombre} required />
              <InputField label="Descripción" value={descripcion} onChangeText={setDesc}
                placeholder="Ingredientes o descripción" error={errs.descripcion}
                multiline numberOfLines={2} required />
              <InputField label="Precio (MXN)" value={precio} onChangeText={setPrecio}
                placeholder="0.00" keyboardType="decimal-pad" error={errs.precio} required />

              <Text style={[styles.catLabel, { color: theme.text.muted }]}>CATEGORÍA</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                {CATEGORIAS.map(cat => (
                  <TouchableOpacity key={cat}
                    style={[styles.catChip, { backgroundColor: theme.bg.input, borderColor: theme.border.default },
                      categoria === cat && { backgroundColor: theme.accent.subtle, borderColor: theme.accent.primary }]}
                    onPress={() => setCategoria(cat)}>
                    <Ionicons name={CAT_ICON[cat]} size={13} color={categoria === cat ? theme.accent.primary : theme.text.muted} />
                    <Text style={[styles.catChipText, { color: categoria === cat ? theme.accent.primary : theme.text.secondary },
                      categoria === cat && { fontWeight: '700' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={[styles.switchRow, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}>
                <Text style={[styles.switchLabel, { color: theme.text.secondary }]}>Disponible en menú</Text>
                <Switch value={disponible} onValueChange={setDisponible}
                  trackColor={{ false: theme.bg.card, true: theme.accent.dark }}
                  thumbColor={disponible ? theme.accent.primary : theme.text.muted} />
              </View>

              <Button label={editando ? 'Guardar cambios' : 'Agregar al menú'}
                onPress={guardar} style={{ marginBottom: Spacing.xl }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screenX, paddingTop: Spacing.screenT, paddingBottom: Spacing.md },
  titulo:       { ...Typography.h1 },
  subtitulo:    { ...Typography.body, marginTop: 2 },
  btnAdd:       { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 9 },
  btnAddText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
  tabs:         { maxHeight: 46, marginBottom: Spacing.sm },
  tab:          { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, borderRadius: Radius.full, marginRight: 8, borderWidth: 1 },
  tabText:      { fontSize: 12, fontWeight: '600' },
  tabCnt:       { width: 17, height: 17, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  tabCntText:   { fontSize: 9, fontWeight: '800' },
  lista:        { paddingHorizontal: Spacing.screenX, paddingBottom: 30 },
  card:         { borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  cardTop:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  cardInfo:     { flex: 1, marginRight: Spacing.sm },
  platNombre:   { ...Typography.h4 },
  platDesc:     { ...Typography.small, marginTop: 3, lineHeight: 17 },
  platPrecio:   { fontSize: 18, fontWeight: '900', marginTop: 6 },
  dispTag:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  dispDot:      { width: 6, height: 6, borderRadius: 3 },
  dispText:     { fontSize: 10, fontWeight: '700' },
  cardActions:  { flexDirection: 'row', gap: 8 },
  btnAction:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: Radius.sm, paddingVertical: 8 },
  btnActionText:{ fontSize: 12, fontWeight: '600' },
  empty:        { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:    { ...Typography.h4 },
  btnEmptyAdd:  { borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, paddingVertical: 10 },
  overlay:      { flex: 1, justifyContent: 'flex-end' },
  modalBox:     { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '92%', borderTopWidth: 1 },
  handle:       { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitulo:  { ...Typography.h2 },
  closeBtn:     { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  catLabel:     { ...Typography.label, marginBottom: Spacing.sm },
  catChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, marginRight: 8, borderWidth: 1 },
  catChipText:  { fontSize: 12, fontWeight: '600' },
  switchRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.md },
  switchLabel:  { ...Typography.body },
});

export default MenuEmpleadoScreen;