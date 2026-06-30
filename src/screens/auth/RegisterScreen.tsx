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
import { registrarUsuario } from '../../database/usuariosDB';
import { Radius, Shadow, Spacing, Typography } from '../../theme/themes';

interface Props { onIrLogin: () => void; }

const RegisterScreen: React.FC<Props> = ({ onIrLogin }) => {
  const { login } = useAuth();
  const { theme, mode } = useTheme();
  const [nombre, setNombre]         = useState('');
  const [correo, setCorreo]         = useState('');
  const [password, setPassword]     = useState('');
  const [confirmar, setConfirmar]   = useState('');
  const [codigo, setCodigo]         = useState('');
  const [mostrarCodigo, setMostrar] = useState(false);
  const [errores, setErrores]       = useState<Record<string, string>>({});

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim() || nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (!correo.trim()) e.correo = 'Obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) e.correo = 'Formato inválido';
    if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirmar) e.confirmar = 'Las contraseñas no coinciden';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleRegistro = () => {
    if (!validar()) return;
    const result = registrarUsuario(nombre, correo, password, codigo || undefined);
    if (!result.ok) { Alert.alert('Error', result.error); return; }
    Alert.alert(
      'Cuenta creada',
      `Bienvenido, ${result.usuario?.nombre}`,
      [{ text: 'Continuar', onPress: () => login(result.usuario!) }]
    );
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
          <View style={[styles.logoWrap, { backgroundColor: theme.bg.card, borderColor: theme.accent.primary + '40' }]}>
            <Ionicons name="person-add-outline" size={30} color={theme.accent.primary} />
          </View>
          <Text style={[styles.titulo, { color: theme.text.primary }]}>Crear cuenta</Text>
          <Text style={[styles.sub, { color: theme.text.muted }]}>Restaurante El Sabor</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border.subtle }, Shadow.card]}>
          <InputField label="Nombre completo" value={nombre} onChangeText={setNombre}
            placeholder="Juan García" error={errores.nombre} required icon="👤" />
          <InputField label="Correo electrónico" value={correo} onChangeText={setCorreo}
            placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none"
            error={errores.correo} required icon="✉️" />
          <InputField label="Contraseña" value={password} onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres" isPassword error={errores.password} required icon="🔒" />
          <InputField label="Confirmar contraseña" value={confirmar} onChangeText={setConfirmar}
            placeholder="Repite tu contraseña" isPassword error={errores.confirmar} required icon="🔒" />

          {/* Sección empleado colapsable */}
          <TouchableOpacity
            style={[styles.empToggle, { borderColor: theme.secondary.primary + '40', backgroundColor: theme.secondary.subtle }]}
            onPress={() => setMostrar(!mostrarCodigo)}
          >
            <Ionicons name="briefcase-outline" size={16} color={theme.secondary.light} />
            <Text style={[styles.empToggleText, { color: theme.secondary.light }]}>
              ¿Eres empleado?
            </Text>
            <Ionicons
              name={mostrarCodigo ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={theme.secondary.light}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {mostrarCodigo && (
            <InputField
              label="Código de empleado" value={codigo} onChangeText={setCodigo}
              placeholder="EMPLEADO2025" autoCapitalize="characters" icon="🔑"
            />
          )}

          <View style={{ height: Spacing.sm }} />
          <Button label="Crear cuenta" onPress={handleRegistro} style={styles.btn} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.muted }]}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={onIrLogin}>
            <Text style={[styles.footerLink, { color: theme.accent.primary }]}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex:          { flex: 1 },
  content:       { padding: Spacing.screenX, paddingTop: 56, paddingBottom: 40 },
  hero:          { alignItems: 'center', marginBottom: Spacing.xl },
  logoWrap:      { width: 76, height: 76, borderRadius: 38, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  titulo:        { ...Typography.h2, marginBottom: 4 },
  sub:           { ...Typography.small, letterSpacing: 0.8 },
  card:          { borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, marginBottom: Spacing.lg },
  empToggle:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.md },
  empToggleText: { ...Typography.h4 },
  btn:           { marginTop: Spacing.sm },
  footer:        { flexDirection: 'row', justifyContent: 'center' },
  footerText:    { ...Typography.body },
  footerLink:    { ...Typography.body, fontWeight: '700' },
});

export default RegisterScreen;