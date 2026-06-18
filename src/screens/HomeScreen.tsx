import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inicio</Text>
      <Text style={styles.subtitulo}>Bienvenido a Artisan Auction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00d4ff',
  },
  subtitulo: {
    fontSize: 16,
    color: '#b0b0b0',
  },
});
