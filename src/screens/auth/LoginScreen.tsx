import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { loginUsuario } from '../../database/usuariosDB';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

interface Props { onIrRegistro: () => void; }

const LoginScreen: React.FC<Props> = ({ onIrRegistro }) => {
  const { login } = useAuth();
  const { theme, mode } = useTheme();
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores]   = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!correo.trim())   e.correo   = 'El correo es obligatorio';
    if (!password.trim()) e.password = 'La contraseña es obligatoria';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validar()) return;
    setLoading(true);
    setTimeout(() => {
      const result = loginUsuario(correo.trim(), password);
      setLoading(false);
      if (!result.ok) { Alert.alert('Acceso denegado', result.error); return; }
      login(result.usuario!);
    }, 350);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.bg.screen }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg.screen}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.hero}>
          <View style={[styles.logoWrap, { backgroundColor: theme.bg.card, borderColor: theme.accent.primary + '40' }, Shadow.sm]}>
            <Ionicons name="restaurant" size={36} color={theme.accent.primary} />
          </View>
          <Text style={[styles.appName, { color: theme.text.primary }]}>El Sabor</Text>
          <Text style={[styles.tagline, { color: theme.text.muted }]}>Alta cocina · Experiencia premium</Text>
        </View>

        {/* Formulario */}
        <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.subtle }, Shadow.card]}>
          <Text style={[styles.cardTitle, { color: theme.text.primary }]}>Bienvenido de vuelta</Text>
          <Text style={[styles.cardSub, { color: theme.text.muted }]}>Inicia sesión para continuar</Text>

          <View style={styles.fields}>
            <InputField
              label="Correo electrónico" value={correo} onChangeText={setCorreo}
              placeholder="tu@correo.com" keyboardType="email-address"
              autoCapitalize="none" autoCorrect={false}
              error={errores.correo} required icon="✉️"
            />
            <InputField
              label="Contraseña" value={password} onChangeText={setPassword}
              placeholder="••••••••" isPassword
              error={errores.password} required icon="🔒"
            />
          </View>

          <Button label="Iniciar sesión" onPress={handleLogin} loading={loading} style={styles.btn} />
        </View>

        {/* Registro */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.muted }]}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={onIrRegistro}>
            <Text style={[styles.footerLink, { color: theme.accent.primary }]}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>

        {/* Hint empleado */}
        <View style={[styles.hint, { backgroundColor: theme.bg.card, borderColor: theme.border.subtle }]}>
          <Ionicons name="briefcase-outline" size={20} color={theme.secondary.light} />
          <View style={styles.hintText}>
            <Text style={[styles.hintTitle, { color: theme.secondary.light }]}>¿Eres empleado?</Text>
            <Text style={[styles.hintDesc, { color: theme.text.muted }]}>
              Regístrate con el código de empleado para acceder al panel de gestión.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex:      { flex: 1 },
  content:   { padding: Spacing.screenX, paddingTop: 64, paddingBottom: 40 },
  hero:      { alignItems: 'center', marginBottom: Spacing.xl },
  logoWrap:  { width: 86, height: 86, borderRadius: 43, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  appName:   { ...Typography.h1, marginBottom: 4 },
  tagline:   { ...Typography.small, letterSpacing: 1 },
  card:      { borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, marginBottom: Spacing.lg },
  cardTitle: { ...Typography.h3, marginBottom: 4 },
  cardSub:   { ...Typography.body, marginBottom: Spacing.lg },
  fields:    { marginBottom: Spacing.sm },
  btn:       { marginTop: Spacing.sm },
  footer:    { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.lg },
  footerText:{ ...Typography.body },
  footerLink:{ ...Typography.body, fontWeight: '700' },
  hint:      { flexDirection: 'row', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, alignItems: 'flex-start' },
  hintText:  { flex: 1 },
  hintTitle: { ...Typography.h4, marginBottom: 3 },
  hintDesc:  { ...Typography.small, lineHeight: 18 },
});

export default LoginScreen;