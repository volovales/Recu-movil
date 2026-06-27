import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Radius, Typography } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  label, onPress, color = '#9303C5',
  variant = 'solid', loading, disabled, style,
}) => {
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        isSolid  && { backgroundColor: color },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: color },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={isSolid ? '#fff' : color} size="small" />
        : <Text style={[
            styles.label,
            isSolid  && { color: '#fff' },
            !isSolid && { color: color },
          ]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  label:   { ...Typography.h4, letterSpacing: 0.5 },
  disabled: { opacity: 0.5 },
});

export default Button;