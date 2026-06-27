import React, { useState } from 'react';
import {
    Alert,
    ScrollView, StatusBar,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { loginUsuario } from '../../database/usuariosDB';

interface Props {
  onIrRegistro: () => void;
}

const LoginScreen: React.FC<Props> = ({ onIrRegistro }) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState<{ correo?: string; password?: string }>({});
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const e: { correo?: string; password?: string } = {};
    if (!correo.trim()) e.correo = 'Ingresa tu correo';
    if (!password.trim()) e.password = 'Ingresa tu contraseña';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validar()) return;
    setCargando(true);
    const result = loginUsuario(correo, password);
    setCargando(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    login(result.usuario!);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      <View style={styles.header}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.titulo}>Restaurante El Sabor</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico <Text style={styles.req}>*</Text></Text>
        <TextInput
          style={[styles.input, errores.correo && styles.inputError]}
          value={correo}
          onChangeText={setCorreo}
          placeholder="tu@correo.com"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

        <Text style={styles.label}>Contraseña <Text style={styles.req}>*</Text></Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.inputFlex, errores.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            placeholderTextColor="#555"
            secureTextEntry={!verPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setVerPassword(!verPassword)}>
            <Text style={styles.eyeIcon}>{verPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        {errores.password && <Text style={styles.errorText}>{errores.password}</Text>}

        <TouchableOpacity
          style={[styles.btnLogin, cargando && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={cargando}
        >
          <Text style={styles.btnLoginText}>{cargando ? 'Entrando…' : 'Iniciar sesión'}</Text>
        </TouchableOpacity>

        <View style={styles.registroRow}>
          <Text style={styles.registroTexto}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={onIrRegistro}>
            <Text style={styles.registroLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  content: { padding: 28, paddingTop: 80, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 12 },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
  subtitulo: { color: '#666', fontSize: 14, marginTop: 6 },
  form: { gap: 4 },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  req: { color: '#00d4ff' },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  inputError: { borderColor: '#ff6b6b' },
  inputFlex: { flex: 1 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 13,
    borderWidth: 1,
    borderColor: '#2a2a6e',
  },
  eyeIcon: { fontSize: 18 },
  errorText: { color: '#ff6b6b', fontSize: 12, marginTop: 4 },
  btnLogin: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnLoginText: { color: '#0f0f2e', fontSize: 16, fontWeight: '800' },
  registroRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registroTexto: { color: '#666', fontSize: 14 },
  registroLink: { color: '#00d4ff', fontSize: 14, fontWeight: '700' },
});

export default LoginScreen;