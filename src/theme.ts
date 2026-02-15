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
        main: mode === 'dark' ? '#7C9CE0' : '#5B7BD6',
      },
      secondary: {
        main: mode === 'dark' ? '#A8D5BA' : '#6BBF7A',
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
    },
  });
}
