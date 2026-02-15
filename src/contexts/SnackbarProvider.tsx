import { useState, useCallback, type ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarContext } from './snackbarContext';

type Severity = 'success' | 'error' | 'info';

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<Severity>('success');

  const show = useCallback((msg: string, sev: Severity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((msg: string) => show(msg, 'success'), [show]);
  const showError = useCallback((msg: string) => show(msg, 'error'), [show]);
  const showInfo = useCallback((msg: string) => show(msg, 'info'), [show]);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
