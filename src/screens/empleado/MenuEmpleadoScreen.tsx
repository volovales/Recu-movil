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
import InputField from '../../components/InputField';
import {
    Platillo,
    actualizarPlatillo,
    crearPlatillo,
    eliminarPlatillo,
    obtenerPlatillos,
} from '../../database/platillosDB';

const CATEGORIAS = ['Tacos', 'Entradas', 'Sopas', 'Bebidas', 'Postres', 'Otros'];
const CATEGORIA_EMOJI: Record<string, string> = {
  Tacos: '🌮', Entradas: '🥗', Sopas: '🍲',
  Bebidas: '🥤', Postres: '🍮', Otros: '🍽️',
};

interface Errores {
  nombre?: string;
  descripcion?: string;
  precio?: string;
}

const MenuEmpleadoScreen: React.FC = () => {
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Tacos');
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Platillo | null>(null);

  // Campos del form
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [disponible, setDisponible] = useState(true);
  const [errores, setErrores] = useState<Errores>({});

  const cargar = useCallback(() => setPlatillos(obtenerPlatillos()), []);
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const platillosFiltrados = platillos.filter(p => p.categoria === categoriaActiva);

  const abrirNuevo = () => {
    setEditando(null);
    setNombre(''); setDescripcion(''); setPrecio('');
    setCategoria(categoriaActiva); setDisponible(true); setErrores({});
    setModalVisible(true);
  };

  const abrirEditar = (p: Platillo) => {
    setEditando(p);
    setNombre(p.nombre); setDescripcion(p.descripcion);
    setPrecio(String(p.precio)); setCategoria(p.categoria);
    setDisponible(p.disponible === 1); setErrores({});
    setModalVisible(true);
  };

  const validar = (): boolean => {
    const e: Errores = {};
    if (!nombre.trim() || nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres';
    if (!descripcion.trim()) e.descripcion = 'La descripción es obligatoria';
    const p = parseFloat(precio);
    if (!precio.trim()) e.precio = 'El precio es obligatorio';
    else if (isNaN(p) || p <= 0) e.precio = 'Ingresa un precio válido mayor a 0';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;
    const datos = {
      nombre: nombre.trim(), descripcion: descripcion.trim(),
      precio: parseFloat(precio), categoria,
      disponible: disponible ? 1 : 0,
    };
    if (editando?.id) actualizarPlatillo(editando.id, datos);
    else crearPlatillo(datos);
    setModalVisible(false);
    cargar();
  };

  const confirmarEliminar = (id: number, nombre: string) => {
    Alert.alert('Eliminar platillo', `¿Eliminar "${nombre}" del menú?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { eliminarPlatillo(id); cargar(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Menú 🍜</Text>
          <Text style={styles.subtitulo}>{platillos.length} platillos en total</Text>
        </View>
        <TouchableOpacity style={styles.btnAgregar} onPress={abrirNuevo}>
          <Text style={styles.btnAgregarText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs de categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {CATEGORIAS.map(cat => {
          const count = platillos.filter(p => p.categoria === cat).length;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, categoriaActiva === cat && styles.tabActivo]}
              onPress={() => setCategoriaActiva(cat)}
            >
              <Text style={styles.tabEmoji}>{CATEGORIA_EMOJI[cat]}</Text>
              <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActivo]}>
                {cat}
              </Text>
              {count > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de platillos de la categoría */}
      <FlatList
        data={platillosFiltrados}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardInfo}>
                <Text style={styles.platilloNombre}>{item.nombre}</Text>
                <Text style={styles.platilloDesc} numberOfLines={2}>{item.descripcion}</Text>
              </View>
              <View style={styles.cardDerecha}>
                <Text style={styles.platilloPrecio}>${item.precio.toFixed(2)}</Text>
                <View style={[styles.dispBadge, item.disponible ? styles.dispOn : styles.dispOff]}>
                  <Text style={styles.dispText}>
                    {item.disponible ? '✅ Activo' : '⛔ Inactivo'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.cardAcciones}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => abrirEditar(item)}>
                <Text style={styles.btnEditarText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnEliminar}
                onPress={() => item.id && confirmarEliminar(item.id, item.nombre)}
              >
                <Text style={styles.btnEliminarText}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>{CATEGORIA_EMOJI[categoriaActiva]}</Text>
            <Text style={styles.vacioTexto}>Sin platillos en {categoriaActiva}</Text>
            <TouchableOpacity style={styles.btnVacioAgregar} onPress={abrirNuevo}>
              <Text style={styles.btnVacioAgregarText}>+ Agregar el primero</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal formulario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {editando ? '✏️ Editar platillo' : '➕ Nuevo platillo'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cerrar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputField label="Nombre" value={nombre} onChangeText={setNombre}
                placeholder="Ej. Tacos al Pastor" error={errores.nombre} required />

              <InputField label="Descripción" value={descripcion} onChangeText={setDescripcion}
                placeholder="Ingredientes o descripción breve" error={errores.descripcion}
                multiline numberOfLines={2} required />

              <InputField label="Precio (MXN)" value={precio} onChangeText={setPrecio}
                placeholder="0.00" keyboardType="decimal-pad" error={errores.precio} required />

              {/* Selector categoría */}
              <Text style={styles.labelCat}>Categoría <Text style={{ color: '#00d4ff' }}>*</Text></Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {CATEGORIAS.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, categoria === cat && styles.catBtnActivo]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={styles.catBtnEmoji}>{CATEGORIA_EMOJI[cat]}</Text>
                    <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActivo]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Switch disponible */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Disponible en menú</Text>
                <Switch value={disponible} onValueChange={setDisponible}
                  trackColor={{ false: '#3a1010', true: '#1b1b5c' }}
                  thumbColor={disponible ? '#00d4ff' : '#888'} />
              </View>

              <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
                <Text style={styles.btnGuardarText}>
                  {editando ? 'Guardar cambios' : 'Agregar al menú'}
                </Text>
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
  btnAgregar: {
    backgroundColor: '#1b1b5c', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#00d4ff',
  },
  btnAgregarText: { color: '#00d4ff', fontWeight: '700', fontSize: 15 },
  tabsScroll: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 60 },
  tab: {
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 22, marginRight: 8, backgroundColor: '#16213e',
    borderWidth: 1, borderColor: '#2a2a6e', flexDirection: 'row', gap: 6,
  },
  tabActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  tabEmoji: { fontSize: 16 },
  tabText: { color: '#888', fontSize: 13, fontWeight: '600' },
  tabTextActivo: { color: '#00d4ff', fontWeight: '700' },
  tabBadge: {
    backgroundColor: '#00d4ff', borderRadius: 10,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
  },
  tabBadgeText: { color: '#0f0f2e', fontSize: 10, fontWeight: '800' },
  lista: { padding: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#16213e', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#2a2a6e',
  },
  cardTop: { flexDirection: 'row', marginBottom: 10 },
  cardInfo: { flex: 1, marginRight: 10 },
  platilloNombre: { color: '#fff', fontSize: 16, fontWeight: '700' },
  platilloDesc: { color: '#888', fontSize: 12, marginTop: 3, lineHeight: 17 },
  cardDerecha: { alignItems: 'flex-end' },
  platilloPrecio: { color: '#00d4ff', fontSize: 20, fontWeight: '900' },
  dispBadge: { marginTop: 4, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  dispOn: { backgroundColor: '#1a3a1a' },
  dispOff: { backgroundColor: '#3a1a1a' },
  dispText: { fontSize: 10, color: '#aaa' },
  cardAcciones: { flexDirection: 'row', gap: 8 },
  btnEditar: {
    flex: 1, backgroundColor: '#1b1b5c', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a6e',
  },
  btnEditarText: { color: '#00d4ff', fontSize: 13, fontWeight: '600' },
  btnEliminar: {
    flex: 1, backgroundColor: '#3a1010', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center',
  },
  btnEliminarText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600' },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioEmoji: { fontSize: 52, marginBottom: 12 },
  vacioTexto: { color: '#aaa', fontSize: 16, marginBottom: 16 },
  btnVacioAgregar: {
    backgroundColor: '#1b1b5c', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#00d4ff',
  },
  btnVacioAgregarText: { color: '#00d4ff', fontWeight: '700' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#0f0f2e', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%', borderTopWidth: 1, borderColor: '#2a2a6e',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitulo: { color: '#fff', fontSize: 19, fontWeight: '800' },
  cerrar: { color: '#666', fontSize: 22, padding: 4 },
  labelCat: { color: '#ccc', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  catBtn: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, marginRight: 8, backgroundColor: '#16213e',
    borderWidth: 1, borderColor: '#2a2a6e',
  },
  catBtnActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  catBtnEmoji: { fontSize: 18, marginBottom: 2 },
  catBtnText: { color: '#888', fontSize: 11 },
  catBtnTextActivo: { color: '#00d4ff', fontWeight: '700' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#16213e', padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#2a2a6e', marginBottom: 16,
  },
  switchLabel: { color: '#ccc', fontSize: 15 },
  btnGuardar: {
    backgroundColor: '#00d4ff', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
  },
  btnGuardarText: { color: '#0f0f2e', fontSize: 16, fontWeight: '800' },
});

export default MenuEmpleadoScreen;