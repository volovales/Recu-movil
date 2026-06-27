import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const MiCuentaScreen: React.FC = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>👤</Text>
      </View>

      <Text style={styles.nombre}>{usuario?.nombre}</Text>
      <Text style={styles.correo}>{usuario?.correo}</Text>

      <View style={[styles.rolBadge, { backgroundColor: '#1a3a1a' }]}>
        <Text style={[styles.rolText, { color: '#26de81' }]}>🍽️ Cliente</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValor}>{usuario?.nombre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Correo</Text>
          <Text style={styles.infoValor}>{usuario?.correo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rol</Text>
          <Text style={styles.infoValor}>Cliente</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Miembro desde</Text>
          <Text style={styles.infoValor}>
            {usuario?.created_at
              ? new Date(usuario.created_at).toLocaleDateString('es-MX')
              : 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#2a2a6e', marginBottom: 16,
  },
  avatarEmoji: { fontSize: 44 },
  nombre: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  correo: { color: '#666', fontSize: 14, marginBottom: 14 },
  rolBadge: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 28 },
  rolText: { fontSize: 13, fontWeight: '700' },
  infoCard: {
    backgroundColor: '#16213e', borderRadius: 14, width: '100%',
    padding: 16, borderWidth: 1, borderColor: '#2a2a6e', marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a4a',
  },
  infoLabel: { color: '#888', fontSize: 14 },
  infoValor: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' },
  btnLogout: {
    width: '100%', borderWidth: 1, borderColor: '#ff6b6b',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  btnLogoutText: { color: '#ff6b6b', fontSize: 15, fontWeight: '700' },
});

export default MiCuentaScreen;