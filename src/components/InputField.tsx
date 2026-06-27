import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Dark, Radius, Spacing, Typography } from '../theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  accentColor?: string;
  isPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label, error, required, accentColor = '#9303C5', isPassword, style, ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label.toUpperCase()}
        {required && <Text style={[styles.req, { color: accentColor }]}> *</Text>}
      </Text>
      <View style={[
        styles.inputWrap,
        focused && { borderColor: accentColor },
        error && styles.inputError,
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Dark.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword && !visible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:    { marginBottom: Spacing.md },
  label:      { ...Typography.label, color: Dark.textMuted, marginBottom: Spacing.sm },
  req:        { fontWeight: '700' },
  inputWrap:  {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Dark.bg3, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Dark.border,
  },
  input: {
    flex: 1, color: Dark.textPrimary,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    fontSize: 15,
  },
  inputError: { borderColor: '#EF4444' },
  eyeBtn:     { paddingHorizontal: Spacing.md },
  eyeIcon:    { fontSize: 18 },
  errorText:  { color: '#EF4444', fontSize: 12, marginTop: 4 },
});

export default InputField;