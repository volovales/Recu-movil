import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Platillo } from '../database/platillosDB';

interface PlatilloCardProps {
  platillo: Platillo;
  onEditar: (platillo: Platillo) => void;
  onEliminar: (id: number) => void;
}

const CATEGORIA_COLORES: Record<string, string> = {
  'Tacos': '#ff9f43',
  'Platillos Fuertes': '#ee5a24',
  'Bebidas': '#0abde3',
  'Sopas': '#feca57',
  'Postres': '#ff6b81',
};

const PlatilloCard: React.FC<PlatilloCardProps> = ({ platillo, onEditar, onEliminar }) => {
  const colorCategoria = CATEGORIA_COLORES[platillo.categoria] ?? '#00d4ff';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.categoriaTag}>
          <Text style={[styles.categoriaText, { color: colorCategoria }]}>
            {platillo.categoria}
          </Text>
        </View>
        <View style={[styles.badge, platillo.disponible ? styles.badgeOn : styles.badgeOff]}>
          <Text style={styles.badgeText}>
            {platillo.disponible ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </View>

      <Text style={styles.nombre}>{platillo.nombre}</Text>
      <Text style={styles.descripcion} numberOfLines={2}>{platillo.descripcion}</Text>

      <View style={styles.footer}>
        <Text style={styles.precio}>${platillo.precio.toFixed(2)}</Text>
        <View style={styles.acciones}>
          <TouchableOpacity style={styles.btnEditar} onPress={() => onEditar(platillo)}>
            <Text style={styles.btnEditarText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnEliminar}
            onPress={() => platillo.id && onEliminar(platillo.id)}
          >
            <Text style={styles.btnEliminarText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaTag: {
    backgroundColor: '#0f0f2e',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoriaText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeOn: {
    backgroundColor: '#1a4a1a',
  },
  badgeOff: {
    backgroundColor: '#4a1a1a',
  },
  badgeText: {
    fontSize: 11,
    color: '#aaa',
  },
  nombre: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  descripcion: {
    color: '#999',
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: '800',
  },
  acciones: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEditar: {
    backgroundColor: '#1b1b5c',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnEditarText: {
    color: '#00d4ff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnEliminar: {
    backgroundColor: '#3a1010',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnEliminarText: {
    fontSize: 14,
  },
});

export default PlatilloCard;