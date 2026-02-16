import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box, Typography, Link } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  createAppTheme,
  getStoredTheme,
  setStoredTheme,
} from './theme';
import { SnackbarProvider } from './contexts/SnackbarProvider';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './pages/Dashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';

function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 1.5,
        px: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        textAlign: 'center',
        zIndex: (t) => t.zIndex.appBar - 1,
      }}
    >
      <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" sx={{ mr: 1.5 }}>
          Kebijakan Privasi
        </Link>
        <span> · </span>
        <Link component={RouterLink} to="/terms" color="inherit" underline="hover" sx={{ ml: 1.5 }}>
          Ketentuan Penggunaan
        </Link>
      </Typography>
    </Box>
  );
}

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
        <BrowserRouter>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                position: 'fixed',
                top: 25,
                right: 12,
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
            <Box sx={{ flex: 1, pb: 7 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
              </Routes>
            </Box>
            <AppFooter />
          </Box>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && <AppContent />}
    </>
  );
}
