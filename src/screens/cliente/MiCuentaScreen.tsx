import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AvatarPicker from '../../components/AvatarPicker';
import Button from '../../components/Button';
import EditNameModal from '../../components/EditNameModal';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

const MiCuentaScreen: React.FC = () => {
  const { usuario, logout, updateAvatar, updateNombre } = useAuth();
  const { theme, mode } = useTheme();
  const [editNameVisible, setEditNameVisible] = useState(false);

  const rows = [
    { icon: 'mail-outline',     label: 'Correo',        val: usuario?.correo ?? '' },
    { icon: 'shield-outline',   label: 'Rol',           val: 'Cliente' },
    { icon: 'calendar-outline', label: 'Miembro desde', val: usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('es-MX') : 'N/A' },
  ];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.bg.screen }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg.screen} />

      <View style={[styles.headerBg, { backgroundColor: theme.accent.subtle }]}>
        <AvatarPicker uri={usuario?.avatar} name={usuario?.nombre} size={96} onImageSelected={updateAvatar} />
        <Text style={[styles.nombre, { color: theme.text.primary }]}>{usuario?.nombre}</Text>
        <Text style={[styles.correo, { color: theme.text.secondary }]}>{usuario?.correo}</Text>
        <View style={[styles.rolBadge, { backgroundColor: theme.accent.primary }]}>
          <Text style={[styles.rolText, { color: '#fff' }]}>Cliente</Text>
        </View>
      </View>

      {/* Editar nombre */}
      <TouchableOpacity
        style={[styles.section, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}
        onPress={() => setEditNameVisible(true)}
        activeOpacity={0.75}
      >
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <Ionicons name="person-outline" size={18} color={theme.accent.primary} />
            <View>
              <Text style={[styles.sectionLabel, { color: theme.text.primary }]}>Editar nombre</Text>
              <Text style={[styles.sectionSub, { color: theme.text.muted }]}>{usuario?.nombre}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.text.muted} />
        </View>
      </TouchableOpacity>

      {/* Toggle tema */}
      <View style={[styles.section, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <Ionicons name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'} size={18} color={theme.accent.primary} />
            <View>
              <Text style={[styles.sectionLabel, { color: theme.text.primary }]}>
                Modo {mode === 'dark' ? 'oscuro' : 'claro'}
              </Text>
              <Text style={[styles.sectionSub, { color: theme.text.muted }]}>
                Se guarda en tu cuenta
              </Text>
            </View>
          </View>
          <ThemeToggle userId={usuario?.id} />
        </View>
      </View>

      {/* Info */}
      <View style={[styles.infoCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }, Shadow.sm]}>
        <Text style={[styles.infoTitle, { color: theme.text.muted }]}>INFORMACIÓN DE CUENTA</Text>
        {rows.map((r, i) => (
          <View
            key={i}
            style={[styles.infoRow, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border.subtle }]}
          >
            <View style={styles.infoLeft}>
              <Ionicons name={r.icon as any} size={15} color={theme.text.muted} />
              <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>{r.label}</Text>
            </View>
            <Text style={[styles.infoVal, { color: theme.text.primary }]} numberOfLines={1}>{r.val}</Text>
          </View>
        ))}
      </View>

      <Button
        label="Cerrar sesión"
        onPress={() => Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: logout },
        ])}
        variant="outline"
        style={styles.logoutBtn}
      />

      <EditNameModal
        visible={editNameVisible}
        currentName={usuario?.nombre ?? ''}
        onClose={() => setEditNameVisible(false)}
        onSave={updateNombre}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  content:      { paddingBottom: 40 },
  headerBg:     { alignItems: 'center', paddingTop: Spacing.screenT, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.screenX, gap: Spacing.sm },
  nombre:       { ...Typography.h2, marginTop: Spacing.sm },
  correo:       { ...Typography.body },
  rolBadge:     { borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 5, marginTop: 4 },
  rolText:      { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  section:      { marginHorizontal: Spacing.screenX, marginTop: Spacing.md, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLeft:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionLabel: { ...Typography.h4 },
  sectionSub:   { ...Typography.small, marginTop: 2 },
  infoCard:     { marginHorizontal: Spacing.screenX, marginTop: Spacing.md, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1 },
  infoTitle:    { ...Typography.label, marginBottom: Spacing.md },
  infoRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 },
  infoLeft:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel:    { ...Typography.body },
  infoVal:      { ...Typography.body, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 12 },
  logoutBtn:    { marginHorizontal: Spacing.screenX, marginTop: Spacing.lg },
});

export default MiCuentaScreen;