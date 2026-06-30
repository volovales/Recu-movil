import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Radius, Spacing, Typography } from '../theme/themes';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  isPassword?: boolean;
  icon?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label, error, required, isPassword, icon, style, ...props
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.text.muted }]}>
        {label.toUpperCase()}
        {required && <Text style={{ color: theme.accent.primary }}> *</Text>}
      </Text>
      <View style={[
        styles.row,
        { backgroundColor: theme.bg.input, borderColor: theme.border.default },
        focused && { borderColor: theme.accent.primary },
        !!error && { borderColor: theme.status.error },
      ]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          style={[styles.input, { color: theme.text.primary }, style]}
          placeholderTextColor={theme.text.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword && !visible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
            <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <Text style={[styles.error, { color: theme.status.error }]}>⚠ {error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label:   { ...Typography.label, marginBottom: Spacing.sm },
  row:     { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, borderWidth: 1.5 },
  icon:    { paddingLeft: Spacing.md, fontSize: 16 },
  input:   { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: 14, fontSize: 15 },
  eye:     { paddingHorizontal: Spacing.md, paddingVertical: 14 },
  eyeIcon: { fontSize: 16 },
  error:   { ...Typography.small, marginTop: 4 },
});

export default InputField;