import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { Goal } from '../types/goal';
import { formatCurrency } from '../utils/currency';
import { calculatePercentage } from '../utils/percentage';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onAddSaving: (goal: Goal) => void;
}

function progressColor(percent: number): 'error' | 'warning' | 'success' {
  if (percent < 30) return 'error';
  if (percent < 70) return 'warning';
  return 'success';
}

const cardSx = {
  borderRadius: 2,
  overflow: 'hidden' as const,
  borderColor: 'divider',
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    borderColor: 'divider',
  },
};

const cardSxDark = {
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
};

export function GoalCard({ goal, onEdit, onDelete, onAddSaving }: GoalCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const percent = calculatePercentage(goal.savedAmount, goal.targetAmount);
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const colorKey = progressColor(percent);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(goal);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(goal);
  };

  const handleAddSaving = () => {
    handleMenuClose();
    onAddSaving(goal);
  };

  return (
    <Card
      variant="outlined"
      sx={[
        cardSx,
        (theme) => (theme.palette.mode === 'dark' ? cardSxDark : {}),
      ]}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {goal.icon?.includes(':') ? (
                <Icon icon={goal.icon} width={24} height={24} />
              ) : (
                <Typography component="span" sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
                  {goal.icon || '🎯'}
                </Typography>
              )}
            </Box>
            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ letterSpacing: '-0.01em' }}>
              {goal.title}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label="Goal menu"
            aria-controls={open ? 'goal-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ flexShrink: 0, ml: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Target
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: 'tabular-nums' }} color={colorKey}>
            {percent}%
          </Typography>
        </Box>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', mb: 1 }}
        >
          {formatCurrency(goal.targetAmount, goal.currency)}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={percent}
          color={colorKey}
          sx={{
            height: 6,
            borderRadius: 1,
            mb: 1,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': { borderRadius: 1 },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Saved
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(goal.savedAmount, goal.currency)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Remaining
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(remaining, goal.currency)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Menu
        id="goal-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'goal-menu' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleAddSaving}>Add Saving</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
