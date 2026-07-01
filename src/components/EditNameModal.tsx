import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Radius, Spacing, Typography } from '../theme/themes';
import Button from './Button';
import InputField from './InputField';

interface Props {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (nombre: string) => { ok: boolean; error?: string };
}

const EditNameModal: React.FC<Props> = ({ visible, currentName, onClose, onSave }) => {
  const { theme } = useTheme();
  const [nombre, setNombre] = useState(currentName);
  const [error, setError]   = useState<string | undefined>();

  // Sincroniza el campo cada vez que se abre el modal
  useEffect(() => {
    if (visible) {
      setNombre(currentName);
      setError(undefined);
    }
  }, [visible, currentName]);

  const handleGuardar = () => {
    const result = onSave(nombre);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: theme.bg.overlay }]}>
        <View style={[styles.card, { backgroundColor: theme.bg.elevated, borderColor: theme.border.default }]}>
          <View style={styles.header}>
            <Text style={[styles.titulo, { color: theme.text.primary }]}>Editar nombre</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.bg.input }]}>
              <Ionicons name="close" size={18} color={theme.text.secondary} />
            </TouchableOpacity>
          </View>

          <InputField
            label="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
            error={error}
            required
            autoFocus
          />

          <View style={styles.actions}>
            <Button label="Cancelar" onPress={onClose} variant="outline" style={styles.btn} />
            <Button label="Guardar" onPress={handleGuardar} style={styles.btn} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  card: {
    width: '100%', borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg,
  },
  titulo: { ...Typography.h3 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  btn: { flex: 1 },
});

export default EditNameModal;