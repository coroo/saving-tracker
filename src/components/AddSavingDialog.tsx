import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Goal, SavingTransactionType } from '../types/goal';
import { formatCurrency } from '../utils/currency';

interface AddSavingDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
  onConfirm: (goalId: string, amount: number, type: SavingTransactionType) => void;
}

export function AddSavingDialog({
  open,
  goal,
  onClose,
  onConfirm,
}: AddSavingDialogProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<SavingTransactionType>('debit');
  const [error, setError] = useState('');

  const maxDebit = goal ? goal.targetAmount - goal.savedAmount : 0;
  const maxCredit = goal ? goal.savedAmount : 0;
  const maxAmount = type === 'debit' ? maxDebit : maxCredit;

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setAmount('');
      setType('debit');
      setError('');
    });
    return () => cancelAnimationFrame(id);
  }, [open, goal?.id]);

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: SavingTransactionType | null) => {
    if (newType !== null) {
      setType(newType);
      setAmount('');
      setError('');
    }
  };

  const handleChange = (value: string) => {
    setAmount(value);
    setError('');
    const num = parseFloat(value);
    if (value !== '' && (Number.isNaN(num) || num <= 0)) {
      setError('Masukkan jumlah yang valid (positif)');
    } else if (value !== '' && num > maxAmount) {
      setError(
        type === 'debit'
          ? `Maksimal sisa: ${formatCurrency(maxAmount, goal?.currency ?? 'USD')}`
          : `Maksimal yang bisa dikurangi: ${formatCurrency(maxAmount, goal?.currency ?? 'USD')}`
      );
    }
  };

  const handleSubmit = () => {
    if (!goal) return;
    const num = parseFloat(amount);
    if (Number.isNaN(num) || num <= 0) {
      setError('Masukkan jumlah yang valid (positif)');
      return;
    }
    if (num > maxAmount) {
      setError(
        type === 'debit'
          ? `Maksimal: ${formatCurrency(maxAmount, goal.currency)}`
          : `Maksimal: ${formatCurrency(maxAmount, goal.currency)}`
      );
      return;
    }
    onConfirm(goal.id, num, type);
    onClose();
  };

  const isValid =
    amount !== '' &&
    !Number.isNaN(parseFloat(amount)) &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= maxAmount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          alignSelf: 'flex-start',
          mt: 2,
          mb: 2,
          maxHeight: 'calc(100vh - 32px)',
        },
      }}
    >
      <DialogTitle>{type === 'debit' ? 'Tambah' : 'Kurangi'} Tabungan</DialogTitle>
      <DialogContent>
        {goal && (
          <Box sx={{ pt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              {goal.icon?.includes(':') ? (
                <Icon icon={goal.icon} width={22} height={22} />
              ) : (
                <Typography component="span" variant="body2" color="text.secondary">
                  {goal.icon || '🎯'}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {goal.title}
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleTypeChange}
              fullWidth
              sx={{ mb: 2 }}
              size="small"
            >
              <ToggleButton value="debit" aria-label="Tambah (debit)">
                <AddCircleOutlineIcon sx={{ mr: 0.5 }} fontSize="small" />
                Tambah
              </ToggleButton>
              <ToggleButton value="credit" aria-label="Kurangi (credit)">
                <RemoveCircleOutlineIcon sx={{ mr: 0.5 }} fontSize="small" />
                Kurangi
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {type === 'debit'
                ? `Sisa menuju target: ${formatCurrency(maxDebit, goal.currency)}`
                : `Tersimpan saat ini: ${formatCurrency(goal.savedAmount, goal.currency)}`}
            </Typography>

            <TextField
              autoFocus
              fullWidth
              label="Jumlah"
              type="number"
              inputProps={{ min: 0, max: maxAmount, step: 'any' }}
              value={amount}
              onChange={(e) => handleChange(e.target.value)}
              error={Boolean(error)}
              helperText={error}
              placeholder="0"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          {type === 'debit' ? 'Tambah' : 'Kurangi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
