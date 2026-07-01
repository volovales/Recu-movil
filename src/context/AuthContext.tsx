import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { Usuario, actualizarAvatar, actualizarNombre } from '../database/usuariosDB';

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  esEmpleado: boolean;
  updateAvatar: (uri: string) => void;
  updateNombre: (nombre: string) => { ok: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = useCallback((u: Usuario) => {
    setUsuario(u);
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
  }, []);

  // Actualiza el avatar en memoria Y en BD
  const updateAvatar = useCallback((uri: string) => {
    if (!usuario?.id) return;
    actualizarAvatar(usuario.id, uri);
    setUsuario(prev => prev ? { ...prev, avatar: uri } : prev);
  }, [usuario]);

  // Actualiza el nombre en BD y refresca el contexto inmediatamente
  const updateNombre = useCallback((nombre: string): { ok: boolean; error?: string } => {
    if (!usuario?.id) return { ok: false, error: 'No hay sesión activa.' };
    const result = actualizarNombre(usuario.id, nombre);
    if (!result.ok) return result;
    setUsuario(prev => prev ? { ...prev, nombre: nombre.trim() } : prev);
    return { ok: true };
  }, [usuario]);

  const esEmpleado = usuario?.rol === 'empleado';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esEmpleado, updateAvatar, updateNombre }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};