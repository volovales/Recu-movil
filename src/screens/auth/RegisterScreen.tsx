import React, { useState } from 'react';
import {
    Alert,
    ScrollView, StatusBar,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { registrarUsuario } from '../../database/usuariosDB';

interface Props {
  onIrLogin: () => void;
}

const RegisterScreen: React.FC<Props> = ({ onIrLogin }) => {
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [codigoEmpleado, setCodigoEmpleado] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim() || nombre.trim().length < 2)
      e.nombre = 'Mínimo 2 caracteres';
    if (!correo.trim())
      e.correo = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      e.correo = 'Formato de correo inválido';
    if (password.length < 6)
      e.password = 'Mínimo 6 caracteres';
    if (password !== confirmar)
      e.confirmar = 'Las contraseñas no coinciden';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleRegistro = () => {
    if (!validar()) return;
    const result = registrarUsuario(nombre, correo, password, codigoEmpleado || undefined);
    if (!result.ok) {
      Alert.alert('Error al registrar', result.error);
      return;
    }
    const rol = result.usuario?.rol === 'empleado' ? 'empleado' : 'cliente';
    Alert.alert(
      '¡Registro exitoso! 🎉',
      `Bienvenido ${result.usuario?.nombre}. Tu cuenta fue creada como ${rol}.`,
      [{ text: 'Continuar', onPress: () => login(result.usuario!) }]
    );
  };

  const Field = ({
    label, value, onChange, placeholder, error, secure, keyboard, autoCapitalize,
  }: {
    label: string; value: string; onChange: (t: string) => void;
    placeholder: string; error?: string; secure?: boolean;
    keyboard?: any; autoCapitalize?: any;
  }) => (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label} <Text style={styles.req}>*</Text></Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#555"
        secureTextEntry={secure}
        keyboardType={keyboard}
        autoCapitalize={autoCapitalize ?? 'words'}
        autoCorrect={false}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor="#0f0f2e" />

      <View style={styles.header}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Restaurante El Sabor</Text>
      </View>

      <Field label="Nombre completo" value={nombre} onChange={setNombre}
        placeholder="Ej. Juan García" error={errores.nombre} />

      <Field label="Correo electrónico" value={correo} onChange={setCorreo}
        placeholder="tu@correo.com" error={errores.correo}
        keyboard="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Contraseña <Text style={styles.req}>*</Text></Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.inputFlex, errores.password && styles.inputError]}
          value={password} onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres" placeholderTextColor="#555"
          secureTextEntry={!verPassword}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setVerPassword(!verPassword)}>
          <Text>{verPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
      {errores.password && <Text style={styles.errorText}>{errores.password}</Text>}

      <Field label="Confirmar contraseña" value={confirmar} onChange={setConfirmar}
        placeholder="Repite tu contraseña" error={errores.confirmar} secure={!verPassword}
        autoCapitalize="none" />

      {/* Código empleado (opcional, colapsable) */}
      <TouchableOpacity
        style={styles.codigoToggle}
        onPress={() => setMostrarCodigo(!mostrarCodigo)}
      >
        <Text style={styles.codigoToggleText}>
          {mostrarCodigo ? '▼' : '▶'} ¿Eres empleado? Ingresa tu código
        </Text>
      </TouchableOpacity>

      {mostrarCodigo && (
        <View style={{ marginBottom: 4 }}>
          <TextInput
            style={styles.input}
            value={codigoEmpleado}
            onChangeText={setCodigoEmpleado}
            placeholder="Código de empleado"
            placeholderTextColor="#555"
            autoCapitalize="characters"
          />
          <Text style={styles.hint}>
            Si el código es correcto, tu cuenta tendrá acceso de empleado.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.btnRegistro} onPress={handleRegistro}>
        <Text style={styles.btnRegistroText}>Crear cuenta</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginTexto}>¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={onIrLogin}>
          <Text style={styles.loginLink}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f2e' },
  content: { padding: 28, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 48, marginBottom: 10 },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitulo: { color: '#666', fontSize: 14, marginTop: 4 },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  req: { color: '#00d4ff' },
  input: {
    backgroundColor: '#16213e', color: '#fff', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    borderWidth: 1, borderColor: '#2a2a6e',
  },
  inputFlex: { flex: 1 },
  inputError: { borderColor: '#ff6b6b' },
  passwordRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  eyeBtn: {
    backgroundColor: '#16213e', borderRadius: 10, padding: 13,
    borderWidth: 1, borderColor: '#2a2a6e',
  },
  errorText: { color: '#ff6b6b', fontSize: 12, marginTop: 4 },
  codigoToggle: { marginTop: 16, marginBottom: 10 },
  codigoToggleText: { color: '#00d4ff', fontSize: 13, fontWeight: '600' },
  hint: { color: '#555', fontSize: 11, marginTop: 6 },
  btnRegistro: {
    backgroundColor: '#00d4ff', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
  },
  btnRegistroText: { color: '#0f0f2e', fontSize: 16, fontWeight: '800' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginTexto: { color: '#666', fontSize: 14 },
  loginLink: { color: '#00d4ff', fontSize: 14, fontWeight: '700' },
});

export default RegisterScreen;