import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Usuario } from '../database/usuariosDB';
import { Crimson, Violet } from '../theme';

interface AuthContextType {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  esEmpleado: boolean;
  accent: typeof Violet;   // paleta activa según rol
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const esEmpleado = usuario?.rol === 'empleado';
  const accent = esEmpleado ? Crimson : Violet;

  return (
    <AuthContext.Provider value={{ usuario, login: setUsuario, logout: () => setUsuario(null), esEmpleado, accent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};