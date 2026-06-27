import { getDatabase } from './database';

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
  rol: 'cliente' | 'empleado';
  created_at?: string;
}

export const CODIGO_EMPLEADO = 'EMPLEADO2025';

// Validar formato de correo
export const validarCorreo = (correo: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

// Verificar si correo ya existe
export const correoExiste = (correo: string): boolean => {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM usuarios WHERE correo = ?',
    [correo.toLowerCase().trim()]
  );
  return (result?.count ?? 0) > 0;
};

// Registrar usuario
export const registrarUsuario = (
  nombre: string,
  correo: string,
  password: string,
  codigoEmpleado?: string
): { ok: boolean; error?: string; usuario?: Usuario } => {
  // Validaciones
  if (!nombre.trim() || nombre.trim().length < 2)
    return { ok: false, error: 'El nombre debe tener al menos 2 caracteres.' };

  if (!validarCorreo(correo))
    return { ok: false, error: 'El correo no tiene un formato válido.' };

  if (correoExiste(correo))
    return { ok: false, error: 'Este correo ya está registrado.' };

  if (password.length < 6)
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };

  const rol: 'cliente' | 'empleado' =
    codigoEmpleado?.trim() === CODIGO_EMPLEADO ? 'empleado' : 'cliente';

  const db = getDatabase();
  const result = db.runSync(
    'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
    [nombre.trim(), correo.toLowerCase().trim(), password, rol]
  );

  const usuario = db.getFirstSync<Usuario>(
    'SELECT * FROM usuarios WHERE id = ?',
    [result.lastInsertRowId]
  );

  return { ok: true, usuario: usuario ?? undefined };
};

// Login
export const loginUsuario = (
  correo: string,
  password: string
): { ok: boolean; error?: string; usuario?: Usuario } => {
  if (!correo.trim()) return { ok: false, error: 'Ingresa tu correo.' };
  if (!password.trim()) return { ok: false, error: 'Ingresa tu contraseña.' };

  const db = getDatabase();
  const usuario = db.getFirstSync<Usuario>(
    'SELECT * FROM usuarios WHERE correo = ? AND password = ?',
    [correo.toLowerCase().trim(), password]
  );

  if (!usuario) return { ok: false, error: 'Correo o contraseña incorrectos.' };

  return { ok: true, usuario };
};

// Obtener usuario por id
export const obtenerUsuarioPorId = (id: number): Usuario | null => {
  const db = getDatabase();
  return db.getFirstSync<Usuario>('SELECT * FROM usuarios WHERE id = ?', [id]) ?? null;
};

// Obtener todos los usuarios (para empleado)
export const obtenerUsuarios = (): Usuario[] => {
  const db = getDatabase();
  return db.getAllSync<Usuario>('SELECT * FROM usuarios ORDER BY created_at DESC');
};