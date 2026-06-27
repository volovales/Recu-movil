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
import InputField from '../components/InputField';
import OrdenCard from '../components/OrdenCard';
import {
  Orden,
  actualizarOrden,
  crearOrden,
  eliminarOrden,
  obtenerOrdenes,
} from '../database/ordenesDB';

const ESTADOS: Orden['estado'][] = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

const ESTADO_LABELS: Record<string, string> = {
  pendiente: '⏳ Pendiente',
  en_preparacion: '👨‍🍳 Preparando',
  listo: '✅ Listo',
  entregado: '🍽️ Entregado',
  cancelado: '❌ Cancelado',
};

interface Errores {
  mesa?: string;
  cliente?: string;
  total?: string;
  estado?: string;
}

const HabilidadesScreen: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Orden | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Campos del formulario
  const [mesa, setMesa] = useState('');
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');
  const [notas, setNotas] = useState('');
  const [estado, setEstado] = useState<Orden['estado']>('pendiente');
  const [errores, setErrores] = useState<Errores>({});

  const cargarOrdenes = useCallback(() => {
    setOrdenes(obtenerOrdenes());
  }, []);

  useFocusEffect(useCallback(() => { cargarOrdenes(); }, [cargarOrdenes]));

  const abrirModalNuevo = () => {
    setEditando(null);
    setMesa('');
    setCliente('');
    setTotal('');
    setNotas('');
    setEstado('pendiente');
    setErrores({});
    setModalVisible(true);
  };

  const abrirModalEditar = (orden: Orden) => {
    setEditando(orden);
    setMesa(String(orden.numero_mesa));
    setCliente(orden.cliente);
    setTotal(String(orden.total));
    setNotas(orden.notas ?? '');
    setEstado(orden.estado);
    setErrores({});
    setModalVisible(true);
  };

  const validar = (): boolean => {
    const nuevosErrores: Errores = {};

    const mesaNum = parseInt(mesa);
    if (!mesa.trim()) nuevosErrores.mesa = 'El número de mesa es obligatorio';
    else if (isNaN(mesaNum) || mesaNum <= 0) nuevosErrores.mesa = 'Ingresa un número de mesa válido (mayor a 0)';
    else if (mesaNum > 99) nuevosErrores.mesa = 'Número de mesa máximo: 99';

    if (!cliente.trim()) nuevosErrores.cliente = 'El nombre del cliente es obligatorio';
    else if (cliente.trim().length < 2) nuevosErrores.cliente = 'Nombre muy corto (mínimo 2 caracteres)';

    const totalNum = parseFloat(total);
    if (!total.trim()) nuevosErrores.total = 'El total es obligatorio';
    else if (isNaN(totalNum)) nuevosErrores.total = 'Ingresa un número válido';
    else if (totalNum < 0) nuevosErrores.total = 'El total no puede ser negativo';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    const datos = {
      numero_mesa: parseInt(mesa),
      cliente: cliente.trim(),
      estado,
      total: parseFloat(total),
      notas: notas.trim(),
    };

    if (editando?.id) {
      actualizarOrden(editando.id, datos);
    } else {
      crearOrden(datos);
    }

    setModalVisible(false);
    cargarOrdenes();
  };

  const confirmarEliminar = (id: number) => {
    Alert.alert(
      'Eliminar orden',
      '¿Seguro que deseas eliminar esta orden? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarOrden(id);
            cargarOrdenes();
          },
        },
      ]
    );
  };

  const cambiarEstado = (id: number, nuevoEstado: Orden['estado']) => {
    actualizarOrden(id, { estado: nuevoEstado });
    cargarOrdenes();
  };

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: '⏳ Pendiente' },
    { key: 'en_preparacion', label: '👨‍🍳 Prep.' },
    { key: 'listo', label: '✅ Listo' },
    { key: 'entregado', label: '🍽️ Entregado' },
  ];

  const ordenesFiltradas =
    filtroEstado === 'todos' ? ordenes : ordenes.filter(o => o.estado === filtroEstado);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Órdenes 📋</Text>
          <Text style={styles.subtitulo}>{ordenes.length} órdenes en total</Text>
        </View>
        <TouchableOpacity style={styles.btnAgregar} onPress={abrirModalNuevo}>
          <Text style={styles.btnAgregarText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de estado */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
        {filtros.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtroBtn, filtroEstado === f.key && styles.filtroBtnActivo]}
            onPress={() => setFiltroEstado(f.key)}
          >
            <Text style={[styles.filtroBtnText, filtroEstado === f.key && styles.filtroBtnTextActivo]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de órdenes */}
      <FlatList
        data={ordenesFiltradas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <OrdenCard
            orden={item}
            onEditar={abrirModalEditar}
            onEliminar={confirmarEliminar}
            onCambiarEstado={cambiarEstado}
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>📭</Text>
            <Text style={styles.vacioTexto}>
              {filtroEstado === 'todos' ? 'Sin órdenes registradas' : 'Sin órdenes con este estado'}
            </Text>
            <Text style={styles.vacioSub}>Presiona "+ Nueva" para crear una</Text>
          </View>
        }
      />

      {/* Modal formulario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {editando ? '✏️ Editar orden' : '➕ Nueva orden'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cerrar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputField
                label="Número de mesa"
                value={mesa}
                onChangeText={setMesa}
                placeholder="Ej. 5"
                keyboardType="number-pad"
                error={errores.mesa}
                required
              />

              <InputField
                label="Nombre del cliente"
                value={cliente}
                onChangeText={setCliente}
                placeholder="Ej. Juan García"
                error={errores.cliente}
                required
              />

              <InputField
                label="Total (MXN)"
                value={total}
                onChangeText={setTotal}
                placeholder="0.00"
                keyboardType="decimal-pad"
                error={errores.total}
                required
              />

              <InputField
                label="Notas (opcional)"
                value={notas}
                onChangeText={setNotas}
                placeholder="Sin picante, sin cebolla, etc."
                multiline
                numberOfLines={2}
              />

              {/* Selector de estado */}
              <Text style={styles.labelEstado}>Estado de la orden</Text>
              <View style={styles.estadosGrid}>
                {ESTADOS.map(e => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.estadoBtn, estado === e && styles.estadoBtnActivo]}
                    onPress={() => setEstado(e)}
                  >
                    <Text style={[styles.estadoBtnText, estado === e && styles.estadoBtnTextActivo]}>
                      {ESTADO_LABELS[e]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
                <Text style={styles.btnGuardarText}>
                  {editando ? 'Guardar cambios' : 'Crear orden'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
  },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#666', fontSize: 13, marginTop: 2 },
  btnAgregar: {
    backgroundColor: '#1b1b5c',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  btnAgregarText: { color: '#00d4ff', fontWeight: '700', fontSize: 15 },
  filtros: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 44 },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  filtroBtnActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  filtroBtnText: { color: '#888', fontSize: 13 },
  filtroBtnTextActivo: { color: '#00d4ff', fontWeight: '700' },
  lista: { padding: 16 },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioEmoji: { fontSize: 48, marginBottom: 12 },
  vacioTexto: { color: '#aaa', fontSize: 16, fontWeight: '600' },
  vacioSub: { color: '#555', fontSize: 13, marginTop: 4 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0f0f2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    borderTopWidth: 1,
    borderColor: '#2a2a6e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: { color: '#fff', fontSize: 19, fontWeight: '800' },
  cerrar: { color: '#666', fontSize: 22, padding: 4 },
  labelEstado: { color: '#ccc', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  estadosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  estadoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  estadoBtnActivo: { backgroundColor: '#1b1b5c', borderColor: '#00d4ff' },
  estadoBtnText: { color: '#888', fontSize: 12 },
  estadoBtnTextActivo: { color: '#00d4ff', fontWeight: '700' },
  btnGuardar: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  btnGuardarText: { color: '#0f0f2e', fontSize: 16, fontWeight: '800' },
});

export default HabilidadesScreen;