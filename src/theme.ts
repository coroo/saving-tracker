import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const THEME_STORAGE_KEY = 'saving_goals_theme';

export function getStoredTheme(): PaletteMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    // ignore
  }
  return 'light';
}

export function setStoredTheme(mode: PaletteMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#60A5FA' : '#2563EB',
        light: mode === 'dark' ? '#93C5FD' : '#3B82F6',
        dark: mode === 'dark' ? '#3B82F6' : '#1D4ED8',
      },
      secondary: {
        main: mode === 'dark' ? '#34D399' : '#10B981',
        light: mode === 'dark' ? '#6EE7B7' : '#34D399',
      },
      success: {
        main: '#22C55E',
        light: '#4ADE80',
        dark: '#16A34A',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      background: {
        default: mode === 'dark' ? '#0F1419' : '#F5F6F8',
        paper: mode === 'dark' ? '#1A2332' : '#FFFFFF',
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.9375rem',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px rgba(0,0,0,0.25)'
                : '0 4px 20px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            fontWeight: 600,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'dark'
                ? '0 6px 20px rgba(0,0,0,0.4)'
                : '0 6px 20px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar: {
            borderRadius: 4,
          },
        },
      },
    },
  });
}
