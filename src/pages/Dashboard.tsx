import { useState, useMemo, useEffect, useContext, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Fab,
  Skeleton,
  useTheme,
  useMediaQuery,
  Grid,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import { OpenAddGoalContext } from '../contexts/OpenAddGoalContext';
import { APP_NAME } from '../constants/app';
import type { Goal } from '../types/goal';

export function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useContext(OpenAddGoalContext);
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
    refresh,
  } = useGoals();
  const snackbar = useSnackbar();

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const atTop = useRef(false);
  const pullDistanceRef = useRef(0);

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

  const handleOpenCreate = useCallback(() => {
    setEditingGoal(null);
    setFormOpen(true);
  }, []);

  useEffect(() => {
    return register(handleOpenCreate);
  }, [register, handleOpenCreate]);

  useEffect(() => {
    if (!location.state?.openAddGoal) return;
    navigate(location.pathname, { replace: true, state: {} });
    const id = requestAnimationFrame(() => {
      setEditingGoal(null);
      setFormOpen(true);
    });
    return () => cancelAnimationFrame(id);
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (!isMobile) return;

    const PULL_RESISTANCE = 0.5;
    const PULL_MAX = 100;
    const PULL_THRESHOLD = 55;
    const REFRESH_DURATION = 600;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      atTop.current = window.scrollY <= 8;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!atTop.current) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - touchStartY.current;
      if (delta <= 0) return;
      e.preventDefault();
      const distance = Math.min(delta * PULL_RESISTANCE, PULL_MAX);
      pullDistanceRef.current = distance;
      setPullDistance(distance);
    };

    const handleTouchEnd = () => {
      const currentPull = pullDistanceRef.current;
      pullDistanceRef.current = 0;
      if (currentPull > PULL_THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(0);
        refresh();
        snackbar.showSuccess('Diperbarui');
        setTimeout(() => setIsRefreshing(false), REFRESH_DURATION);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, refresh, snackbar]);

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

  const showPullIndicator = isMobile && (pullDistance > 0 || isRefreshing);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 10,
        bgcolor: 'background.default',
      }}
    >
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            zIndex: (t) => t.zIndex.appBar - 2,
            transition: 'transform 0.2s ease',
            transform: showPullIndicator ? 'translateY(0)' : 'translateY(-100%)',
          }}
        >
          {isRefreshing ? (
            <>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Memperbarui…
              </Typography>
            </>
          ) : (
            <>
              <RefreshIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="body2" color="text.secondary">
                {pullDistance >= 55 ? 'Lepas untuk refresh' : 'Tarik ke bawah untuk refresh'}
              </Typography>
            </>
          )}
        </Box>
      )}

      <Box
        sx={{
          transition: 'transform 0.15s ease-out',
          transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance * 0.3, 24)}px)` : 'none',
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
      </Box>

      {!empty && !isMobile && (
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
