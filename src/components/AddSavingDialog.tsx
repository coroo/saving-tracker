import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Goal } from '../types/goal';
import { formatCurrency } from '../utils/currency';

interface AddSavingDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
  onConfirm: (goalId: string, amount: number) => void;
}

export function AddSavingDialog({
  open,
  goal,
  onClose,
  onConfirm,
}: AddSavingDialogProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const maxAmount = goal ? goal.targetAmount - goal.savedAmount : 0;

  useEffect(() => {
    if (open) {
      setAmount('');
      setError('');
    }
  }, [open, goal?.id]);

  const handleChange = (value: string) => {
    setAmount(value);
    setError('');
    const num = parseFloat(value);
    if (value !== '' && (Number.isNaN(num) || num <= 0)) {
      setError('Enter a valid positive amount');
    } else if (value !== '' && num > maxAmount) {
      setError(`Cannot exceed remaining ${formatCurrency(maxAmount, goal?.currency ?? 'USD')}`);
    }
  };

  const handleSubmit = () => {
    if (!goal) return;
    const num = parseFloat(amount);
    if (Number.isNaN(num) || num <= 0) {
      setError('Enter a valid positive amount');
      return;
    }
    if (num > maxAmount) {
      setError(`Cannot exceed remaining ${formatCurrency(maxAmount, goal.currency)}`);
      return;
    }
    onConfirm(goal.id, num);
    onClose();
  };

  const isValid = amount !== '' && !Number.isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && parseFloat(amount) <= maxAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Saving</DialogTitle>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Remaining: {formatCurrency(maxAmount, goal.currency)}
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Amount"
              type="number"
              inputProps={{ min: 0, max: maxAmount, step: 'any' }}
              value={amount}
              onChange={(e) => handleChange(e.target.value)}
              error={Boolean(error)}
              helperText={error}
              placeholder={`0`}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
