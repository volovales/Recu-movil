import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Radius, Shadow, Spacing, Typography } from '../theme/themes';

const SCREEN = Dimensions.get('window');

interface AvatarPickerProps {
  uri?: string | null;
  name?: string;
  size?: number;
  onImageSelected: (uri: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  uri, name = '', size = 90, onImageSelected,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading]     = useState(false);
  const [preview, setPreview]     = useState(false);   // Modal vista previa

  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const pickImage = async (fromCamera: boolean) => {
    setLoading(true);
    try {
      if (fromCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true, aspect: [1, 1], quality: 0.85,
        });
        if (!result.canceled && result.assets[0]) {
          onImageSelected(result.assets[0].uri);
          setPreview(false);
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsEditing: true, aspect: [1, 1], quality: 0.85,
        });
        if (!result.canceled && result.assets[0]) {
          onImageSelected(result.assets[0].uri);
          setPreview(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFoto = () => {
    Alert.alert('Cambiar fotografía', 'Selecciona una opción', [
      { text: 'Tomar foto', onPress: () => pickImage(true) },
      { text: 'Elegir de galería', onPress: () => pickImage(false) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <>
      {/* Avatar miniatura — solo abre el preview */}
      <TouchableOpacity onPress={() => setPreview(true)} activeOpacity={0.85}>
        <View style={[
          styles.wrap,
          {
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: theme.bg.card,
            borderColor: theme.accent.primary + '60',
            ...Shadow.sm,
          },
        ]}>
          {loading ? (
            <ActivityIndicator color={theme.accent.primary} />
          ) : uri ? (
            <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
          ) : (
            <Text style={{ color: theme.accent.primary, fontSize: size * 0.3, fontWeight: '700' }}>
              {initials || '?'}
            </Text>
          )}
          {/* Icono de edición sobre la foto */}
          <View style={[styles.editBadge, { backgroundColor: theme.accent.primary }]}>
            <Ionicons name="pencil" size={11} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal de vista previa */}
      <Modal visible={preview} animationType="fade" transparent statusBarTranslucent>
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.88)' }]}>
          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeArea} onPress={() => setPreview(false)}>
            <View style={[styles.closeBtn, { backgroundColor: theme.bg.card }]}>
              <Ionicons name="close" size={20} color={theme.text.secondary} />
            </View>
          </TouchableOpacity>

          {/* Foto grande */}
          <View style={[styles.bigWrap, { backgroundColor: theme.bg.card, borderColor: theme.accent.primary + '40' }]}>
            {uri ? (
              <Image source={{ uri }} style={styles.bigImg} />
            ) : (
              <View style={[styles.bigPlaceholder, { backgroundColor: theme.bg.input }]}>
                <Text style={{ color: theme.accent.primary, fontSize: 64, fontWeight: '700' }}>
                  {initials || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.userName, { color: '#fff' }]}>{name}</Text>

          {/* Botón cambiar foto */}
          <TouchableOpacity
            style={[styles.btnChange, { backgroundColor: theme.accent.primary }]}
            onPress={handleChangeFoto}
          >
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.btnChangeText}>Cambiar fotografía</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  editBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  // Modal
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  closeArea: {
    position: 'absolute', top: 52, right: Spacing.lg,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  bigWrap: {
    width: SCREEN.width * 0.72,
    height: SCREEN.width * 0.72,
    borderRadius: SCREEN.width * 0.36,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bigImg: { width: '100%', height: '100%' },
  bigPlaceholder: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
  },
  userName: {
    ...Typography.h3,
    marginBottom: Spacing.xl,
    letterSpacing: 0.3,
  },
  btnChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
  },
  btnChangeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default AvatarPicker;