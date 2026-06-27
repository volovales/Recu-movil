// ─── TEMA CENTRAL ───────────────────────────────────────────────────────────
// Toda la paleta, tipografía, espaciado y radios en un solo lugar.
// Importa desde aquí en cada pantalla: import { Colors, T, Spacing, Radius } from '../theme';

// ── Paleta base (oscura) ───────────────────────────────────────────────────
export const Dark = {
  bg0:        '#02060E',   // fondo más profundo
  bg1:        '#080D1A',   // fondo de pantalla
  bg2:        '#0D1424',   // fondo de tarjeta
  bg3:        '#131D30',   // fondo de input / elemento elevado
  border:     '#1E2D45',   // bordes sutiles
  divider:    '#162030',   // separadores
  textPrimary:   '#F0F4FF',
  textSecondary: '#8899AA',
  textMuted:     '#445566',
};

// ── Paleta base (clara) ────────────────────────────────────────────────────
export const Light = {
  bg0:        '#F0F2F5',
  bg1:        '#FFFFFF',
  bg2:        '#FFFFFF',
  bg3:        '#F5F7FA',
  border:     '#E2E8F0',
  divider:    '#EEF2F7',
  textPrimary:   '#0A1628',
  textSecondary: '#4A6080',
  textMuted:     '#9AAABB',
};

// ── Acento Cliente — Royal Violet ──────────────────────────────────────────
export const Violet = {
  primary:   '#9303C5',
  light:     '#B040E0',
  dark:      '#6A0290',
  glow:      '#9303C522',   // para sombras / halos
  subtle:    '#9303C511',   // fondos de badges
  onPrimary: '#FFFFFF',
};

// ── Acento Empleado — Crimson Noir ────────────────────────────────────────
export const Crimson = {
  primary:   '#C50337',
  light:     '#E0194F',
  dark:      '#8C0228',
  glow:      '#C5033722',
  subtle:    '#C5033711',
  onPrimary: '#FFFFFF',
};

// ── Semánticos ─────────────────────────────────────────────────────────────
export const Status = {
  success:  '#22C55E',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#3B82F6',
  successBg: '#052E1622',
  warningBg: '#451A0322',
  errorBg:   '#450A0A22',
  infoBg:    '#0C1A4522',
};

// ── Colores de estado de pedido ────────────────────────────────────────────
export const OrderStatus = {
  pendiente:      { color: '#F59E0B', bg: '#F59E0B18', label: 'Pendiente',     emoji: '⏳' },
  en_preparacion: { color: '#FB923C', bg: '#FB923C18', label: 'Preparando',    emoji: '👨‍🍳' },
  listo:          { color: '#22C55E', bg: '#22C55E18', label: 'Listo',         emoji: '✅' },
  entregado:      { color: '#6366F1', bg: '#6366F118', label: 'Entregado',     emoji: '🍽️' },
  cancelado:      { color: '#EF4444', bg: '#EF444418', label: 'Cancelado',     emoji: '❌' },
};

// ── Tipografía ─────────────────────────────────────────────────────────────
export const Typography = {
  h1:    { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2:    { fontSize: 22, fontWeight: '700' as const },
  h3:    { fontSize: 18, fontWeight: '700' as const },
  h4:    { fontSize: 16, fontWeight: '600' as const },
  body:  { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  small: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 1.2 },
  price: { fontSize: 22, fontWeight: '900' as const },
};

// ── Espaciado ──────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenH: 52,   // padding top para pantallas (bajo status bar)
  screenX: 20,   // padding horizontal de pantalla
};

// ── Radios ─────────────────────────────────────────────────────────────────
export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

// ── Sombras ────────────────────────────────────────────────────────────────
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};