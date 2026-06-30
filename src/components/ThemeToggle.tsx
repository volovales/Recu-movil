import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Radius } from '../theme/themes';

interface Props {
  userId?: number;  // FIX Error 5: necesario para persistir por usuario
}

const ThemeToggle: React.FC<Props> = ({ userId }) => {
  const { theme, mode, toggleMode } = useTheme();
  const isLight = mode === 'light';

  return (
    <TouchableOpacity
      onPress={() => toggleMode(userId)}   // pasa el userId para guardar en BD
      activeOpacity={0.8}
      style={[
        styles.track,
        {
          backgroundColor: isLight ? theme.accent.subtle : theme.bg.input,
          borderColor: theme.border.default,
        },
      ]}
    >
      <View style={[
        styles.thumb,
        {
          backgroundColor: theme.accent.primary,
          transform: [{ translateX: isLight ? 24 : 2 }],
        },
      ]} />
      <Text style={[styles.iconLeft,  { opacity: isLight ? 0 : 1 }]}>🌙</Text>
      <Text style={[styles.iconRight, { opacity: isLight ? 1 : 0 }]}>☀️</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 56, height: 30, borderRadius: Radius.full,
    borderWidth: 1, flexDirection: 'row',
    alignItems: 'center', position: 'relative',
  },
  thumb: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
  },
  iconLeft:  { position: 'absolute', left: 5,  fontSize: 12 },
  iconRight: { position: 'absolute', right: 5, fontSize: 12 },
});

export default ThemeToggle;