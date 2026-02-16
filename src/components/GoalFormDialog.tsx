import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import type { Goal } from '../types/goal';
import { CURRENCIES } from '../utils/currency';
import { DEFAULT_GOAL_ICON } from '../data/iconCategories';
import { DEFAULT_ICON_COLORS, DEFAULT_ICON_COLOR } from '../constants/app';
import { IconPicker } from './IconPicker';

interface GoalFormDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    icon: string;
    iconColor?: string;
    description?: string;
    currency: string;
    targetAmount: number;
    deadline?: string;
    savedAmount?: number;
  }) => void;
}

const defaultForm = {
  title: '',
  icon: DEFAULT_GOAL_ICON,
  iconColor: DEFAULT_ICON_COLOR as string,
  description: '',
  currency: 'USD',
  targetAmount: '',
  deadline: null as Dayjs | null,
};

export function GoalFormDialog({
  open,
  goal,
  onClose,
  onSubmit,
}: GoalFormDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<{ title?: string; targetAmount?: string }>({});

  const isEdit = goal !== null;
  const savedAmount = goal?.savedAmount ?? 0;

  useEffect(() => {
    if (!open) return;
    const nextForm = goal
      ? {
          title: goal.title,
          icon: goal.icon?.includes(':') ? goal.icon : DEFAULT_GOAL_ICON,
          iconColor: goal.iconColor ?? defaultForm.iconColor,
          description: goal.description ?? '',
          currency: goal.currency,
          targetAmount: String(goal.targetAmount),
          deadline: goal.deadline ? dayjs(goal.deadline) : null,
        }
      : defaultForm;
    const id = requestAnimationFrame(() => {
      setForm(nextForm);
      setErrors({});
    });
    return () => cancelAnimationFrame(id);
  }, [open, goal]);

  const handleSubmit = () => {
    const title = form.title.trim();
    const targetNum = parseFloat(form.targetAmount);
    const newErrors: { title?: string; targetAmount?: string } = {};

    if (!title) newErrors.title = 'Title is required';
    if (form.targetAmount === '' || Number.isNaN(targetNum)) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (targetNum < savedAmount) {
      newErrors.targetAmount = `Target must be at least ${savedAmount} (current saved)`;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      title,
      icon: form.icon || DEFAULT_GOAL_ICON,
      iconColor: form.iconColor,
      description: form.description.trim() || undefined,
      currency: form.currency,
      targetAmount: targetNum,
      deadline: form.deadline ? form.deadline.toISOString() : undefined,
      ...(isEdit ? { savedAmount } : {}),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Goal' : 'New Goal'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <IconPicker
            label="Icon"
            value={form.icon}
            onChange={(iconId) => setForm((f) => ({ ...f, icon: iconId }))}
          />
          <Box>
            <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
              Warna ikon
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {DEFAULT_ICON_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, iconColor: color }))}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: form.iconColor === color ? 'primary.main' : 'transparent',
                    boxSizing: 'border-box',
                    '&:hover': { opacity: 0.9 },
                  }}
                  aria-label={`Pilih warna ${color}`}
                />
              ))}
            </Box>
          </Box>
          <TextField
            label="Goal Title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={Boolean(errors.title)}
            helperText={errors.title}
            placeholder="e.g. Emergency Fund"
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            rows={2}
            placeholder="Optional"
          />
          <TextField
            select
            label="Currency"
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Target Amount"
            required
            type="number"
            inputProps={{ min: savedAmount, step: 'any' }}
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
            error={Boolean(errors.targetAmount)}
            helperText={errors.targetAmount}
            placeholder="0"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline (optional)"
              value={form.deadline}
              onChange={(d) => setForm((f) => ({ ...f, deadline: d }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
