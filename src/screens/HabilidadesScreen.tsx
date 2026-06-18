import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HabilidadesScreen() {
  const habilidades = [
    { titulo: 'Programación', items: ['JavaScript', 'TypeScript', 'React Native'] },
    { titulo: 'Bases de Datos', items: ['SQL', 'MongoDB', 'Firebase'] },
    { titulo: 'Herramientas', items: ['Git', 'Docker', 'VS Code'] },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Habilidades</Text>
      </View>

      {habilidades.map((grupo, index) => (
        <View key={index} style={styles.skillGroup}>
          <Text style={styles.groupTitle}>{grupo.titulo}</Text>
          <View style={styles.skillsList}>
            {grupo.items.map((skill, idx) => (
              <View key={idx} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
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
  skillGroup: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  skillText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '500',
  },
});
