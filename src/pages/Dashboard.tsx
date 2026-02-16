import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Fab,
  Skeleton,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GoalCard } from '../components/GoalCard';
import { SortableGoalCard } from '../components/SortableGoalCard';
import { GoalFormDialog } from '../components/GoalFormDialog';
import { AddSavingDialog } from '../components/AddSavingDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { GoalHistoryDialog } from '../components/GoalHistoryDialog';
import { useGoals } from '../hooks/useGoals';
import { useSnackbar } from '../hooks/useSnackbar';
import { APP_NAME } from '../constants/app';
import type { Goal } from '../types/goal';

export function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    goals,
    initialized,
    addGoal,
    updateGoal,
    deleteGoal,
    addSaving,
    moveGoalUp,
    moveGoalDown,
    reorderGoals,
  } = useGoals();
  const snackbar = useSnackbar();

  const goalIds = useMemo(() => goals.map((g) => g.id), [goals]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = goalIds.indexOf(active.id as string);
    const newIndex = goalIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(goalIds, oldIndex, newIndex);
    reorderGoals(newOrder);
    snackbar.showSuccess('Urutan diubah');
  };

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addSavingGoal, setAddSavingGoal] = useState<Goal | null>(null);
  const [historyGoal, setHistoryGoal] = useState<Goal | null>(null);
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
    iconColor?: string;
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
        iconColor: data.iconColor,
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
        iconColor: data.iconColor,
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

  const handleAddSavingConfirm = (goalId: string, amount: number, type: 'debit' | 'credit') => {
    const ok = addSaving(goalId, amount, type);
    if (ok) snackbar.showSuccess(type === 'debit' ? 'Tabungan ditambah' : 'Tabungan dikurangi');
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
      <Box sx={{ p: 2, mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <img
            src="/assets/lexa_saving_nobg.png"
            alt=""
            width={36}
            height={36}
            style={{ display: 'block' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {APP_NAME}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lacak tujuan menabung Anda
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
              Belum ada tujuan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Buat tujuan menabung pertama Anda di {APP_NAME}.
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
        ) : isMobile ? (
          <Grid container spacing={2}>
            {goals.map((goal, index) => (
              <Grid item key={goal.id} xs={12}>
                <GoalCard
                  goal={goal}
                  index={index}
                  totalCount={goals.length}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteClick}
                  onAddSaving={setAddSavingGoal}
                  onMoveUp={(g) => {
                    moveGoalUp(g.id);
                    snackbar.showSuccess('Urutan diubah');
                  }}
                  onMoveDown={(g) => {
                    moveGoalDown(g.id);
                    snackbar.showSuccess('Urutan diubah');
                  }}
                  onShowHistory={setHistoryGoal}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Grid container spacing={2}>
              <SortableContext items={goalIds} strategy={verticalListSortingStrategy}>
                {goals.map((goal, index) => (
                  <Grid item key={goal.id} xs={12} sm={6} md={4}>
                    <SortableGoalCard
                      goal={goal}
                      index={index}
                      totalCount={goals.length}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteClick}
                      onAddSaving={setAddSavingGoal}
                      onMoveUp={(g) => {
                        moveGoalUp(g.id);
                        snackbar.showSuccess('Urutan diubah');
                      }}
                      onMoveDown={(g) => {
                        moveGoalDown(g.id);
                        snackbar.showSuccess('Urutan diubah');
                      }}
                      onShowHistory={setHistoryGoal}
                    />
                  </Grid>
                ))}
              </SortableContext>
            </Grid>
          </DndContext>
        )}
      </Box>

      {!empty && (
        <Fab
          color="primary"
          aria-label="Add goal"
          onClick={handleOpenCreate}
          sx={{
            position: 'fixed',
            bottom: 56,
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

      <GoalHistoryDialog
        open={historyGoal !== null}
        goal={historyGoal}
        onClose={() => setHistoryGoal(null)}
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
