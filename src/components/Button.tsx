import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Radius, Typography } from '../theme/themes';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'solid', loading, disabled, style, size = 'md',
}) => {
  const { theme } = useTheme();
  const color = variant === 'danger' ? theme.status.error : theme.accent.primary;

  const pad = size === 'sm' ? 9 : size === 'lg' ? 18 : 14;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.78}
      style={[
        styles.base,
        { paddingVertical: pad, borderRadius: Radius.md },
        variant === 'solid'   && { backgroundColor: color },
        variant === 'danger'  && { backgroundColor: color },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color },
        variant === 'ghost'   && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.45 },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'solid' || variant === 'danger' ? '#fff' : color} size="small" />
        : <Text style={[
            styles.label,
            { color: variant === 'solid' || variant === 'danger' ? '#fff' : color },
            size === 'sm' && { fontSize: 13 },
          ]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:  { alignItems: 'center', justifyContent: 'center' },
  label: { ...Typography.h4, letterSpacing: 0.3 },
});

export default Button;