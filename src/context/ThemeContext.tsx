import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { actualizarTema } from '../database/usuariosDB';
import { AppTheme, ThemeMode, ThemeRole, getTheme } from '../theme/themes';

interface ThemeContextType {
  theme: AppTheme;
  mode: ThemeMode;
  toggleMode: (userId?: number) => void;
  initTheme: (role: ThemeRole, mode: ThemeMode) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole]   = useState<ThemeRole>('cliente');
  const [mode, setMode]   = useState<ThemeMode>('dark');

  const theme = getTheme(role, mode);

  // Llamado al hacer login: carga el tema guardado del usuario
  const initTheme = useCallback((r: ThemeRole, m: ThemeMode) => {
    setRole(r);
    setMode(m);
  }, []);

  // Llamado al hacer logout: resetea a defaults
  const resetTheme = useCallback(() => {
    setRole('cliente');
    setMode('dark');
  }, []);

  // Toggle con persistencia en BD
  const toggleMode = useCallback((userId?: number) => {
    setMode(prev => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      if (userId) actualizarTema(userId, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, initTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
};