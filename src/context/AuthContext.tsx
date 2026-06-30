import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { Usuario, actualizarAvatar } from '../database/usuariosDB';

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  esEmpleado: boolean;
  updateAvatar: (uri: string) => void;   // FIX Error 2
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

  const esEmpleado = usuario?.rol === 'empleado';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esEmpleado, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};