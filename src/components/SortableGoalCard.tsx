import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';
import { GoalCard } from './GoalCard';
import type { Goal } from '../types/goal';

interface SortableGoalCardProps {
  goal: Goal;
  index: number;
  totalCount: number;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onAddSaving: (goal: Goal) => void;
  onMoveUp: (goal: Goal) => void;
  onMoveDown: (goal: Goal) => void;
  onShowHistory: (goal: Goal) => void;
}

export function SortableGoalCard({
  goal,
  index,
  totalCount,
  onEdit,
  onDelete,
  onAddSaving,
  onMoveUp,
  onMoveDown,
  onShowHistory,
}: SortableGoalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ touchAction: 'none' }}>
      <GoalCard
        goal={goal}
        index={index}
        totalCount={totalCount}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddSaving={onAddSaving}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onShowHistory={onShowHistory}
      />
    </Box>
  );
}
