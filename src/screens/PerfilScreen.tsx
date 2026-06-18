import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const nombre: string = "Luis Osvaldo Rivera Ramirez";
const carrera: string = "Ing. en Tecnologías de la Información";
const cuatrimestre: number = 6;
const promedio: number = 8.2;

export default function PerfilScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Image
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis' }}
          style={styles.avatar}
        />
        <Text style={styles.titulo}>{nombre}</Text>
        <Text style={styles.subtitulo}>{carrera}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cuatrimestre:</Text>
          <Text style={styles.cardValue}>{cuatrimestre}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Promedio:</Text>
          <Text style={styles.cardValue}>{promedio}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#ff6b6b',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#00d4ff',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  cardsContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  cardLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
});
