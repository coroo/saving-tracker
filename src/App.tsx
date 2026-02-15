import { useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  createAppTheme,
  getStoredTheme,
  setStoredTheme,
} from './theme';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { Dashboard } from './pages/Dashboard';

function AppContent() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => getStoredTheme());

  useEffect(() => {
    setStoredTheme(mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Box sx={{ minHeight: '100vh' }}>
          <Box
            sx={{
              position: 'fixed',
              top: 8,
              right: 8,
              zIndex: (t) => t.zIndex.appBar,
            }}
          >
            <IconButton
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              color="inherit"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          <Dashboard />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return <AppContent />;
}
