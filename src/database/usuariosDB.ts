import { getDatabase } from './database';

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
  rol: 'cliente' | 'empleado';
  avatar?: string | null;
  tema?: 'dark' | 'light';
  created_at?: string;
}

export const CODIGO_EMPLEADO = 'EMPLEADO2025';

export const validarCorreo = (correo: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

export const correoExiste = (correo: string): boolean => {
  const db = getDatabase();
  const r = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM usuarios WHERE correo = ?',
    [correo.toLowerCase().trim()]
  );
  return (r?.count ?? 0) > 0;
};

export const registrarUsuario = (
  nombre: string, correo: string, password: string, codigoEmpleado?: string
): { ok: boolean; error?: string; usuario?: Usuario } => {
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
    'SELECT * FROM usuarios WHERE id = ?', [result.lastInsertRowId]
  );
  return { ok: true, usuario: usuario ?? undefined };
};

export const loginUsuario = (
  correo: string, password: string
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

export const obtenerUsuarioPorId = (id: number): Usuario | null => {
  const db = getDatabase();
  return db.getFirstSync<Usuario>('SELECT * FROM usuarios WHERE id = ?', [id]) ?? null;
};

// FIX Error 2 y 5: guardar avatar y tema por usuario
export const actualizarAvatar = (id: number, uri: string): void => {
  const db = getDatabase();
  db.runSync('UPDATE usuarios SET avatar = ? WHERE id = ?', [uri, id]);
};

export const actualizarNombre = (
  id: number, nombre: string
): { ok: boolean; error?: string } => {
  const limpio = nombre.trim();
  if (!limpio) return { ok: false, error: 'El nombre no puede estar vacío.' };
  if (limpio.length < 2) return { ok: false, error: 'El nombre debe tener al menos 2 caracteres.' };

  const db = getDatabase();
  db.runSync('UPDATE usuarios SET nombre = ? WHERE id = ?', [limpio, id]);
  return { ok: true };
};

export const actualizarTema = (id: number, tema: 'dark' | 'light'): void => {
  const db = getDatabase();
  db.runSync('UPDATE usuarios SET tema = ? WHERE id = ?', [tema, id]);
};