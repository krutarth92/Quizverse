/**
 * Global Theme Configuration
 * Serves as the single source of truth for primary brand, status, and track-specific colors.
 */
export const THEME_COLORS = {
  // Track Specific & Key Brand Colors
  python: '#FFE600', // Lime/Yellow accent - Python Track, success/perfect achievements, general primary button highlights
  aiMl: '#00F0FF',   // Cyan accent - AI/ML Track, primary info displays, selection highlights
  cloud: '#FF0055',  // Pink/Magenta accent - Cloud Track, critical alerts, cheating blocks, system admin themes

  // Base Infrastructure Colors
  black: '#050505',  // Body, deep container backgrounds
  card: '#111111',   // Panels, card frames, containers
  border: '#222222', // Primary panel structural borders

  // Standard semantic mapping
  success: '#FFE600',
  info: '#00F0FF',
  danger: '#FF0055',
};

export type ThemeColorKey = keyof typeof THEME_COLORS;
