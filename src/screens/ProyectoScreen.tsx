import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProyectoScreen() {
  const proyectos = [
    {
      titulo: 'Artisan Auction',
      descripcion: 'Plataforma móvil de subastas de artesanías',
      fecha: '2024',
    },
    {
      titulo: 'App de Gestión',
      descripcion: 'Sistema de administración de proyectos',
      fecha: '2024',
    },
    {
      titulo: 'Portafolio Web',
      descripcion: 'Sitio web personal y de proyectos',
      fecha: '2023',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Proyectos</Text>
      </View>

      {proyectos.map((proyecto, index) => (
        <View key={index} style={styles.projectCard}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>{proyecto.titulo}</Text>
            <Text style={styles.projectDate}>{proyecto.fecha}</Text>
          </View>
          <Text style={styles.projectDescription}>{proyecto.descripcion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00d4ff',
  },
  projectCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00d4ff',
    flex: 1,
  },
  projectDate: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  projectDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
  },
});
