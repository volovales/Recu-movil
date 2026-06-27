import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Crimson, Dark, Radius, Shadow, Spacing, Typography } from '../../theme';

const CuentaEmpleadoScreen: React.FC = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);

  const rows = [
    { label: 'Nombre', val: usuario?.nombre ?? '' },
    { label: 'Correo', val: usuario?.correo ?? '' },
    { label: 'Rol',    val: 'Empleado' },
    { label: 'Acceso', val: 'Menú + Pedidos + Dashboard' },
    { label: 'Desde',  val: usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('es-MX') : 'N/A' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={Dark.bg0} />

      <View style={styles.avatarArea}>
        <View style={[styles.avatar, { borderColor: Crimson.primary + '55' }]}>
          <Text style={styles.avatarEmoji}>👔</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
        <Text style={styles.correo}>{usuario?.correo}</Text>
        <View style={[styles.rolBadge, { backgroundColor: Crimson.subtle, borderColor: Crimson.primary + '55' }]}>
          <Text style={[styles.rolText, { color: Crimson.light }]}>👔 Empleado</Text>
        </View>
      </View>

      <View style={[styles.infoCard, Shadow.sm]}>
        {rows.map((r, i) => (
          <View key={i} style={[styles.infoRow, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>{r.label}</Text>
            <Text style={styles.infoVal} numberOfLines={1}>{r.val}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutText}>🚪  Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Dark.bg0 },
  content:   { padding: Spacing.screenX, paddingTop: Spacing.screenH, alignItems: 'center', paddingBottom: 40 },
  avatarArea:{ alignItems: 'center', marginBottom: Spacing.xl },
  avatar:    { width: 90, height: 90, borderRadius: 45, backgroundColor: Dark.bg2, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  avatarEmoji: { fontSize: 42 },
  nombre:    { ...Typography.h2, color: Dark.textPrimary },
  correo:    { ...Typography.body, color: Dark.textSecondary, marginTop: 4 },
  rolBadge:  { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, marginTop: Spacing.sm },
  rolText:   { fontSize: 12, fontWeight: '700' },
  infoCard:  { backgroundColor: Dark.bg2, borderRadius: Radius.xl, width: '100%', padding: Spacing.md, borderWidth: 1, borderColor: Dark.border, marginBottom: Spacing.xl },
  infoRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Dark.divider },
  infoLabel: { ...Typography.body, color: Dark.textSecondary },
  infoVal:   { ...Typography.body, color: Dark.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 12 },
  btnLogout: { width: '100%', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center' },
  btnLogoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
});

export default CuentaEmpleadoScreen;