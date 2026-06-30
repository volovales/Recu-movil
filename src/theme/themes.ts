export type ThemeMode = 'dark' | 'light';
export type ThemeRole = 'cliente' | 'empleado';

export interface AppTheme {
  role: ThemeRole;
  mode: ThemeMode;

  // Fondos
  bg: {
    screen:  string;  // fondo de pantalla
    card:    string;  // fondo de tarjeta
    input:   string;  // fondo de input
    elevated:string;  // elementos elevados / modales
    overlay: string;  // overlay de modal
  };

  // Bordes
  border: {
    default: string;
    subtle:  string;
    focus:   string;  // cuando input está enfocado
  };

  // Texto
  text: {
    primary:   string;
    secondary: string;
    muted:     string;
    inverse:   string;  // texto sobre botón primario
    onAccent:  string;
  };

  // Acento principal (morado/rojo)
  accent: {
    primary:  string;
    light:    string;
    dark:     string;
    subtle:   string;  // fondo de badges
    glow:     string;  // sombra de color
  };

  // Acento secundario (azul)
  secondary: {
    primary: string;
    light:   string;
    subtle:  string;
  };

  // Semánticos
  status: {
    success:    string;
    successBg:  string;
    warning:    string;
    warningBg:  string;
    error:      string;
    errorBg:    string;
    info:       string;
    infoBg:     string;
  };

  // Tab bar
  tab: {
    bg:         string;
    active:     string;
    inactive:   string;
    indicator:  string;
    border:     string;
  };
}

// ─── CLIENTE OSCURO ────────────────────────────────────────────
export const clienteDark: AppTheme = {
  role: 'cliente',
  mode: 'dark',
  bg: {
    screen:   '#080A12',
    card:     '#10142A',
    input:    '#0D1022',
    elevated: '#141830',
    overlay:  'rgba(4,5,14,0.85)',
  },
  border: {
    default: '#1E2448',
    subtle:  '#161A36',
    focus:   '#7C3AED',
  },
  text: {
    primary:   '#EEF0FF',
    secondary: '#8B93C4',
    muted:     '#454C7A',
    inverse:   '#FFFFFF',
    onAccent:  '#FFFFFF',
  },
  accent: {
    primary:  '#7C3AED',
    light:    '#9F67F5',
    dark:     '#5B21B6',
    subtle:   '#7C3AED18',
    glow:     '#7C3AED30',
  },
  secondary: {
    primary: '#4F46E5',
    light:   '#6366F1',
    subtle:  '#4F46E518',
  },
  status: {
    success:   '#10B981', successBg:  '#10B98118',
    warning:   '#F59E0B', warningBg:  '#F59E0B18',
    error:     '#EF4444', errorBg:    '#EF444418',
    info:      '#3B82F6', infoBg:     '#3B82F618',
  },
  tab: {
    bg:        '#0A0D1F',
    active:    '#7C3AED',
    inactive:  '#3D4470',
    indicator: '#7C3AED',
    border:    '#161A36',
  },
};

// ─── CLIENTE CLARO ─────────────────────────────────────────────
export const clienteLight: AppTheme = {
  role: 'cliente',
  mode: 'light',
  bg: {
    screen:   '#F4F3FF',
    card:     '#FFFFFF',
    input:    '#F0EFFE',
    elevated: '#FFFFFF',
    overlay:  'rgba(30,20,60,0.5)',
  },
  border: {
    default: '#DDD8F8',
    subtle:  '#EAE8FC',
    focus:   '#7C3AED',
  },
  text: {
    primary:   '#1A1535',
    secondary: '#5B5480',
    muted:     '#9E98C0',
    inverse:   '#FFFFFF',
    onAccent:  '#FFFFFF',
  },
  accent: {
    primary:  '#7C3AED',
    light:    '#9F67F5',
    dark:     '#5B21B6',
    subtle:   '#7C3AED12',
    glow:     '#7C3AED20',
  },
  secondary: {
    primary: '#4F46E5',
    light:   '#6366F1',
    subtle:  '#4F46E512',
  },
  status: {
    success:   '#059669', successBg:  '#05966912',
    warning:   '#D97706', warningBg:  '#D9770612',
    error:     '#DC2626', errorBg:    '#DC262612',
    info:      '#2563EB', infoBg:     '#2563EB12',
  },
  tab: {
    bg:        '#FFFFFF',
    active:    '#7C3AED',
    inactive:  '#B8B0D8',
    indicator: '#7C3AED',
    border:    '#EAE8FC',
  },
};

// ─── EMPLEADO OSCURO ───────────────────────────────────────────
export const empleadoDark: AppTheme = {
  role: 'empleado',
  mode: 'dark',
  bg: {
    screen:   '#09080A',
    card:     '#130F14',
    input:    '#100C12',
    elevated: '#18121A',
    overlay:  'rgba(5,3,6,0.88)',
  },
  border: {
    default: '#2A1A20',
    subtle:  '#1C1018',
    focus:   '#9B1C1C',
  },
  text: {
    primary:   '#F5EDEF',
    secondary: '#A07880',
    muted:     '#5A3840',
    inverse:   '#FFFFFF',
    onAccent:  '#FFFFFF',
  },
  accent: {
    primary:  '#9B1C1C',
    light:    '#C23030',
    dark:     '#7A1515',
    subtle:   '#9B1C1C18',
    glow:     '#9B1C1C30',
  },
  secondary: {
    primary: '#1E3A5F',
    light:   '#2A5285',
    subtle:  '#1E3A5F18',
  },
  status: {
    success:   '#10B981', successBg:  '#10B98118',
    warning:   '#F59E0B', warningBg:  '#F59E0B18',
    error:     '#EF4444', errorBg:    '#EF444418',
    info:      '#3B82F6', infoBg:     '#3B82F618',
  },
  tab: {
    bg:        '#0C080D',
    active:    '#9B1C1C',
    inactive:  '#5A3840',
    indicator: '#9B1C1C',
    border:    '#1C1018',
  },
};

// ─── EMPLEADO CLARO ────────────────────────────────────────────
export const empleadoLight: AppTheme = {
  role: 'empleado',
  mode: 'light',
  bg: {
    screen:   '#FDF5F5',
    card:     '#FFFFFF',
    input:    '#FDF0F0',
    elevated: '#FFFFFF',
    overlay:  'rgba(40,10,10,0.5)',
  },
  border: {
    default: '#F0D8D8',
    subtle:  '#F8EEEE',
    focus:   '#9B1C1C',
  },
  text: {
    primary:   '#220F0F',
    secondary: '#6B3A3A',
    muted:     '#B08080',
    inverse:   '#FFFFFF',
    onAccent:  '#FFFFFF',
  },
  accent: {
    primary:  '#9B1C1C',
    light:    '#C23030',
    dark:     '#7A1515',
    subtle:   '#9B1C1C10',
    glow:     '#9B1C1C1A',
  },
  secondary: {
    primary: '#1E3A5F',
    light:   '#2A5285',
    subtle:  '#1E3A5F10',
  },
  status: {
    success:   '#059669', successBg:  '#05966912',
    warning:   '#D97706', warningBg:  '#D9770612',
    error:     '#DC2626', errorBg:    '#DC262612',
    info:      '#2563EB', infoBg:     '#2563EB12',
  },
  tab: {
    bg:        '#FFFFFF',
    active:    '#9B1C1C',
    inactive:  '#C8A0A0',
    indicator: '#9B1C1C',
    border:    '#F0D8D8',
  },
};

// ─── Tokens compartidos (no cambian con el tema) ────────────────
export const Typography = {
  h1:    { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.8 },
  h2:    { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  h3:    { fontSize: 19, fontWeight: '700' as const },
  h4:    { fontSize: 16, fontWeight: '600' as const },
  body:  { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.4 },
  price: { fontSize: 22, fontWeight: '900' as const },
  micro: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.5 },
};

export const Spacing = {
  xs:      4,
  sm:      8,
  md:      16,
  lg:      24,
  xl:      32,
  xxl:     48,
  screenX: 20,
  screenT: 54,
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   18,
  xl:   24,
  xxl:  32,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const OrderStatus = {
  pendiente:      { color: '#F59E0B', bg: '#F59E0B18', label: 'Pendiente',   icon: 'time-outline' },
  en_preparacion: { color: '#FB923C', bg: '#FB923C18', label: 'Preparando',  icon: 'flame-outline' },
  listo:          { color: '#10B981', bg: '#10B98118', label: 'Listo',       icon: 'checkmark-circle-outline' },
  entregado:      { color: '#6366F1', bg: '#6366F118', label: 'Entregado',   icon: 'bag-check-outline' },
  cancelado:      { color: '#EF4444', bg: '#EF444418', label: 'Cancelado',   icon: 'close-circle-outline' },
};

// Helper: obtener tema según rol y modo
export const getTheme = (role: ThemeRole, mode: ThemeMode): AppTheme => {
  if (role === 'cliente') return mode === 'dark' ? clienteDark : clienteLight;
  return mode === 'dark' ? empleadoDark : empleadoLight;
};