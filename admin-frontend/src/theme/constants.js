// ─── ASTHRA Admin Dashboard — Design Tokens ───────────────────────────────────
// Single source of truth for the colour palette and spacing scale.
// Import this file anywhere you need to reference a design token in JS.
// All CSS custom properties mirror these values in index.css.

export const COLORS = {
  // Primary — violet
  primary: '#6D5BD0',
  primaryLight: '#8576DC',
  primaryDark: '#5647B5',
  primaryGhost: 'rgba(109,91,208,0.10)',

  // Secondary — sky blue
  secondary: '#5AC8FA',
  secondaryLight: '#80D8FF',
  secondaryGhost: 'rgba(90,200,250,0.12)',

  // Backgrounds
  pageBg: '#F5F7FF',
  cardBg: '#FFFFFF',
  sidebarBg: '#1E1B3A',
  sidebarActiveItem: 'rgba(109,91,208,0.22)',

  // Text
  textPrimary: '#2E2E48',
  textSecondary: '#6B6B8D',
  textMuted: '#9999BB',
  textOnDark: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Borders
  borderLight: '#E8E8F7',
  borderMedium: '#D0D0EF',

  // Status
  success: '#22C55E',
  successLight: 'rgba(34,197,94,0.12)',
  danger: '#EF4444',
  dangerLight: 'rgba(239,68,68,0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245,158,11,0.12)',
  info: '#3B82F6',
  infoLight: 'rgba(59,130,246,0.12)',
};

// 8px base unit
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  full: '9999px',
};

export const SHADOW = {
  card: '0 2px 12px rgba(109,91,208,0.08), 0 1px 3px rgba(0,0,0,0.06)',
  modal: '0 20px 60px rgba(46,46,72,0.18)',
  sidebar: '2px 0 24px rgba(30,27,58,0.18)',
};

export const FONT = {
  family: "'Inter', 'Outfit', system-ui, sans-serif",
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '18px',
    xl: '22px',
    xxl: '28px',
    xxxl: '36px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
