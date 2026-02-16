import { useMemo, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton, Box, Typography, Link, Fab, useTheme, useMediaQuery } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PolicyIcon from '@mui/icons-material/Policy';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  createAppTheme,
  getStoredTheme,
  setStoredTheme,
} from './theme';
import { SnackbarProvider } from './contexts/SnackbarProvider';
import { OpenAddGoalContext, OpenAddGoalProvider } from './contexts/OpenAddGoalContext';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './pages/Dashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { Profile } from './pages/Profile';

function AppFooterMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAddGoal } = useContext(OpenAddGoalContext);

  const handleAdd = () => {
    if (location.pathname === '/') {
      openAddGoal();
    } else {
      navigate('/', { state: { openAddGoal: true } });
    }
  };

  const isHome = location.pathname === '/';
  const isTerms = location.pathname === '/terms';
  const isPrivacy = location.pathname === '/privacy';
  const isProfile = location.pathname === '/profile';

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        px: 0.5,
        zIndex: (t) => t.zIndex.appBar - 1,
        boxShadow: (t) => (t.palette.mode === 'dark' ? '0 -2px 12px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.06)'),
      }}
    >
      <IconButton
        component={RouterLink}
        to="/"
        aria-label="Beranda"
        color={isHome ? 'primary' : 'inherit'}
        sx={{ color: isHome ? 'primary.main' : 'text.secondary' }}
      >
        <HomeIcon />
      </IconButton>

      <IconButton
        component={RouterLink}
        to="/terms"
        aria-label="Ketentuan Penggunaan"
        color={isTerms ? 'primary' : 'inherit'}
        sx={{ color: isTerms ? 'primary.main' : 'text.secondary' }}
      >
        <DescriptionIcon />
      </IconButton>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 48 }}>
        <Fab
          color="primary"
          aria-label="Tambah goal"
          onClick={handleAdd}
          sx={{
            mt: -3,
            boxShadow: 2,
            '&:hover': { boxShadow: 4 },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <IconButton
        component={RouterLink}
        to="/privacy"
        aria-label="Kebijakan Privasi"
        color={isPrivacy ? 'primary' : 'inherit'}
        sx={{ color: isPrivacy ? 'primary.main' : 'text.secondary' }}
      >
        <PolicyIcon />
      </IconButton>

      <IconButton
        component={RouterLink}
        to="/profile"
        aria-label="Profil"
        color={isProfile ? 'primary' : 'inherit'}
        sx={{ color: isProfile ? 'primary.main' : 'text.secondary' }}
      >
        <PersonOutlineIcon />
      </IconButton>
    </Box>
  );
}

function AppFooterDesktop() {
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

function AppFooter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile ? <AppFooterMobile /> : <AppFooterDesktop />;
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
          <OpenAddGoalProvider>
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
            <Box sx={{ flex: 1, pb: { xs: 8, sm: 7 } }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>
            <AppFooter />
          </Box>
          </OpenAddGoalProvider>
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
