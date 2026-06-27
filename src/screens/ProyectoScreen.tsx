import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { initDatabase } from '../database/database';

const ProyectoScreen: React.FC = () => {
  const handleReiniciarDB = () => {
    Alert.alert(
      'Reiniciar base de datos',
      'Esto solo recrea las tablas si no existen. No borra datos existentes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reinicializar',
          onPress: async () => {
            await initDatabase();
            Alert.alert('✅ Listo', 'Base de datos verificada correctamente.');
          },
        },
      ]
    );
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      {/* Header del restaurante */}
      <View style={styles.restauranteHeader}>
        <Text style={styles.logoEmoji}>🍽️</Text>
        <Text style={styles.restauranteNombre}>Restaurante El Sabor</Text>
        <Text style={styles.restauranteLema}>Tradición y sazón en cada platillo</Text>
      </View>

      {/* Info del restaurante */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>📍 Información</Text>
        <View style={styles.card}>
          <InfoRow label="Dirección" value="Av. Principal #123, Centro" />
          <InfoRow label="Teléfono" value="+52 (442) 123-4567" />
          <InfoRow label="Horario" value="Lun–Dom: 8:00am – 10:00pm" />
          <InfoRow label="Email" value="contacto@elsabor.mx" />
        </View>
      </View>

      {/* Tecnologías */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>⚙️ Tecnologías usadas</Text>
        <View style={styles.card}>
          <InfoRow label="Framework" value="React Native + Expo 54" />
          <InfoRow label="Lenguaje" value="TypeScript" />
          <InfoRow label="Base de datos" value="SQLite (expo-sqlite)" />
          <InfoRow label="Navegación" value="@react-navigation/bottom-tabs" />
          <InfoRow label="React" value="v19.1.0" />
        </View>
      </View>

      {/* Funcionalidades */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>✅ Funcionalidades implementadas</Text>
        <View style={styles.card}>
          {[
            'SQLite con creación automática de tablas',
            'CRUD completo de platillos (menú)',
            'CRUD completo de órdenes',
            'Persistencia de datos entre sesiones',
            'Validaciones en todos los formularios',
            'Filtros por categoría y estado',
            'Dashboard con estadísticas en tiempo real',
            'Avance de estado de órdenes',
            'Datos de ejemplo al primer inicio',
          ].map((item, i) => (
            <View key={i} style={styles.checkItem}>
              <Text style={styles.checkEmoji}>✅</Text>
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Base de datos */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>🗄️ Base de datos</Text>
        <View style={styles.card}>
          <InfoRow label="Archivo" value="restaurante.db" />
          <InfoRow label="Tablas" value="platillos, ordenes, orden_detalle" />
          <InfoRow label="Motor" value="SQLite (local en dispositivo)" />
        </View>

        <TouchableOpacity style={styles.btnVerificar} onPress={handleReiniciarDB}>
          <Text style={styles.btnVerificarText}>🔄 Verificar / Reinicializar BD</Text>
        </TouchableOpacity>
      </View>

      {/* Créditos */}
      <View style={styles.creditos}>
        <Text style={styles.creditosTexto}>Proyecto de recursamiento • Apps Móvil</Text>
        <Text style={styles.creditosTexto}>Expo SDK 54 • 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  content: { padding: 20, paddingTop: 52, paddingBottom: 40 },
  restauranteHeader: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 24,
    backgroundColor: '#16213e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  logoEmoji: { fontSize: 52, marginBottom: 10 },
  restauranteNombre: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  restauranteLema: {
    color: '#00d4ff',
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  seccion: { marginBottom: 20 },
  seccionTitulo: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a4a',
  },
  infoLabel: { color: '#888', fontSize: 13, flex: 1 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1.5, textAlign: 'right' },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  checkEmoji: { fontSize: 14, lineHeight: 20 },
  checkText: { color: '#ccc', fontSize: 13, flex: 1, lineHeight: 20 },
  btnVerificar: {
    backgroundColor: '#1b1b5c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  btnVerificarText: { color: '#aaa', fontSize: 14, fontWeight: '600' },
  creditos: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a4a',
  },
  creditosTexto: { color: '#444', fontSize: 12, marginBottom: 2 },
});

export default ProyectoScreen;