import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Platillo } from '../database/platillosDB';
import { Radius, Shadow, Spacing, Typography } from '../theme/themes';

// Imágenes de placeholder por categoría (emojis renderizados como fondos)
const CAT_PLACEHOLDER: Record<string, string> = {
  Tacos: '🌮', Entradas: '🥗', Sopas: '🍲',
  Bebidas: '🥤', Postres: '🍮', Otros: '🍽️',
};

interface PlatilloCardProps {
  platillo: Platillo;
  onEditar: (p: Platillo) => void;
  onEliminar: (id: number) => void;
}

const PlatilloCard: React.FC<PlatilloCardProps> = ({ platillo, onEditar, onEliminar }) => {
  const { theme } = useTheme();
  const emoji = CAT_PLACEHOLDER[platillo.categoria] ?? '🍽️';

  return (
    <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.card]}>
      {/* Imagen / placeholder */}
      <View style={[styles.imageArea, { backgroundColor: theme.bg.input }]}>
        {(platillo as any).imagen ? (
          <Image source={{ uri: (platillo as any).imagen }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>{emoji}</Text>
        )}
        {/* Badge disponibilidad */}
        <View style={[
          styles.dispBadge,
          { backgroundColor: platillo.disponible ? theme.status.successBg : theme.status.errorBg },
        ]}>
          <Text style={[styles.dispText, { color: platillo.disponible ? theme.status.success : theme.status.error }]}>
            {platillo.disponible ? '● Activo' : '● Inactivo'}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={[styles.catTag, { backgroundColor: theme.accent.subtle }]}>
          <Text style={[styles.catText, { color: theme.accent.light }]}>{platillo.categoria}</Text>
        </View>
        <Text style={[styles.nombre, { color: theme.text.primary }]} numberOfLines={1}>
          {platillo.nombre}
        </Text>
        <Text style={[styles.desc, { color: theme.text.secondary }]} numberOfLines={2}>
          {platillo.descripcion}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.precio, { color: theme.accent.primary }]}>
            ${platillo.precio.toFixed(2)}
          </Text>
          <View style={styles.acciones}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.bg.input, borderColor: theme.border.default }]}
              onPress={() => onEditar(platillo)}
            >
              <Text style={[styles.btnText, { color: theme.text.secondary }]}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: theme.status.errorBg, borderColor: theme.status.error + '40' }]}
              onPress={() => platillo.id && onEliminar(platillo.id)}
            >
              <Text style={styles.btnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card:      { borderRadius: Radius.lg, marginBottom: Spacing.md, borderWidth: 1, overflow: 'hidden' },
  imageArea: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  image:     { width: '100%', height: '100%' },
  placeholder:{ fontSize: 52 },
  dispBadge: { position: 'absolute', top: 8, right: 8, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  dispText:  { ...Typography.micro },
  info:      { padding: Spacing.md },
  catTag:    { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  catText:   { ...Typography.micro },
  nombre:    { ...Typography.h4, marginBottom: 4 },
  desc:      { ...Typography.small, lineHeight: 18, marginBottom: 10 },
  footer:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio:    { fontSize: 20, fontWeight: '900' },
  acciones:  { flexDirection: 'row', gap: 6 },
  btn:       { width: 34, height: 34, borderRadius: Radius.sm, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  btnText:   { fontSize: 14 },
});

export default PlatilloCard;