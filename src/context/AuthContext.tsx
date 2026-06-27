import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Usuario } from '../database/usuariosDB';

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  esEmpleado: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (u: Usuario) => setUsuario(u);
  const logout = () => setUsuario(null);
  const esEmpleado = usuario?.rol === 'empleado';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esEmpleado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};