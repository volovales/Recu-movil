import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Orden } from '../database/ordenesDB';

interface OrdenCardProps {
  orden: Orden;
  onEditar: (orden: Orden) => void;
  onEliminar: (id: number) => void;
  onCambiarEstado: (id: number, estado: Orden['estado']) => void;
}

const ESTADO_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  pendiente:       { color: '#feca57', emoji: '⏳', label: 'Pendiente' },
  en_preparacion:  { color: '#ff9f43', emoji: '👨‍🍳', label: 'Preparando' },
  listo:           { color: '#00d4ff', emoji: '✅', label: 'Listo' },
  entregado:       { color: '#26de81', emoji: '🍽️', label: 'Entregado' },
  cancelado:       { color: '#ff6b6b', emoji: '❌', label: 'Cancelado' },
};

const SIGUIENTE_ESTADO: Record<string, Orden['estado']> = {
  pendiente: 'en_preparacion',
  en_preparacion: 'listo',
  listo: 'entregado',
  entregado: 'entregado',
  cancelado: 'cancelado',
};

const OrdenCard: React.FC<OrdenCardProps> = ({ orden, onEditar, onEliminar, onCambiarEstado }) => {
  const config = ESTADO_CONFIG[orden.estado] ?? ESTADO_CONFIG.pendiente;
  const siguienteEstado = SIGUIENTE_ESTADO[orden.estado];
  const puedeAvanzar = orden.estado !== 'entregado' && orden.estado !== 'cancelado';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.mesaInfo}>
          <Text style={styles.mesa}>Mesa #{orden.numero_mesa}</Text>
          <Text style={styles.cliente}>👤 {orden.cliente}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: config.color + '22', borderColor: config.color }]}>
          <Text style={[styles.estadoText, { color: config.color }]}>
            {config.emoji} {config.label}
          </Text>
        </View>
      </View>

      {orden.notas ? (
        <Text style={styles.notas}>📝 {orden.notas}</Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.total}>${orden.total.toFixed(2)}</Text>
        <View style={styles.acciones}>
          {puedeAvanzar && (
            <TouchableOpacity
              style={styles.btnAvanzar}
              onPress={() => orden.id && onCambiarEstado(orden.id, siguienteEstado)}
            >
              <Text style={styles.btnAvanzarText}>▶ Avanzar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnEditar} onPress={() => onEditar(orden)}>
            <Text style={styles.btnEditarText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnEliminar}
            onPress={() => orden.id && onEliminar(orden.id)}
          >
            <Text style={styles.btnEliminarText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.fecha}>
        {orden.created_at ? new Date(orden.created_at).toLocaleString('es-MX') : ''}
      </Text>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mesaInfo: {
    flex: 1,
  },
  mesa: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  cliente: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  estadoBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    marginLeft: 8,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notas: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: '800',
  },
  acciones: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  btnAvanzar: {
    backgroundColor: '#1b1b5c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  btnAvanzarText: {
    color: '#00d4ff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnEditar: {
    backgroundColor: '#1b1b5c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnEditarText: {
    fontSize: 14,
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
  fecha: {
    color: '#555',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default OrdenCard;