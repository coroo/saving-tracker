import { useState } from 'react';
import {
  Box,
  Typography,
  Fab,
  Skeleton,
  useTheme,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { GoalCard } from '../components/GoalCard';
import { GoalFormDialog } from '../components/GoalFormDialog';
import { AddSavingDialog } from '../components/AddSavingDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useGoals } from '../hooks/useGoals';
import { useSnackbar } from '../contexts/SnackbarContext';
import type { Goal } from '../types/goal';

export function Dashboard() {
  const theme = useTheme();
  const {
    goals,
    initialized,
    addGoal,
    updateGoal,
    deleteGoal,
    addSaving,
  } = useGoals();
  const snackbar = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addSavingGoal, setAddSavingGoal] = useState<Goal | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Goal | null>(null);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: {
    title: string;
    icon: string;
    description?: string;
    currency: string;
    targetAmount: number;
    deadline?: string;
    savedAmount?: number;
  }) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: data.title,
        icon: data.icon,
        description: data.description,
        currency: data.currency,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
        savedAmount: data.savedAmount,
      });
      snackbar.showSuccess('Goal updated');
    } else {
      addGoal({
        title: data.title,
        icon: data.icon,
        description: data.description,
        currency: data.currency,
        targetAmount: data.targetAmount,
        deadline: data.deadline,
      });
      snackbar.showSuccess('Goal created');
    }
    setFormOpen(false);
    setEditingGoal(null);
  };

  const handleAddSavingConfirm = (goalId: string, amount: number) => {
    const ok = addSaving(goalId, amount);
    if (ok) snackbar.showSuccess('Saving added');
    setAddSavingGoal(null);
  };

  const handleDeleteClick = (goal: Goal) => setConfirmDelete(goal);

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteGoal(confirmDelete.id);
      snackbar.showSuccess('Goal deleted');
      setConfirmDelete(null);
    }
  };

  if (!initialized) {
    return (
      <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const empty = goals.length === 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 10,
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Saving Goals
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Track your progress toward what matters
        </Typography>

        {empty ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 2,
            }}
          >
            <SavingsOutlinedIcon
              sx={{
                fontSize: 80,
                color: theme.palette.action.disabled,
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No goals yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create your first saving goal to start tracking your progress.
            </Typography>
            <Fab
              color="primary"
              aria-label="Add goal"
              onClick={handleOpenCreate}
              sx={{ mt: 1 }}
            >
              <AddIcon />
            </Fab>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {goals.map((goal) => (
              <Grid item key={goal.id} xs={12} sm={6} md={4}>
                <GoalCard
                  goal={goal}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteClick}
                  onAddSaving={setAddSavingGoal}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {!empty && (
        <Fab
          color="primary"
          aria-label="Add goal"
          onClick={handleOpenCreate}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <GoalFormDialog
        open={formOpen}
        goal={editingGoal}
        onClose={() => {
          setFormOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <AddSavingDialog
        open={addSavingGoal !== null}
        goal={addSavingGoal}
        onClose={() => setAddSavingGoal(null)}
        onConfirm={handleAddSavingConfirm}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete goal?"
        message={
          confirmDelete
            ? `"${confirmDelete.title}" and its progress will be removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
}
