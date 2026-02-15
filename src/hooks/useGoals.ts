import { useState, useCallback, useEffect } from 'react';
import type { Goal, GoalFormData } from '../types/goal';
import { getGoals, saveGoals } from '../storage/goalStorage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = getGoals();
    setGoals(stored);
    setInitialized(true);
  }, []);

  const persist = useCallback((next: Goal[]) => {
    setGoals(next);
    saveGoals(next);
  }, []);

  const addGoal = useCallback(
    (data: GoalFormData) => {
      const newGoal: Goal = {
        id: generateId(),
        title: data.title,
        icon: data.icon || '🎯',
        currency: data.currency,
        targetAmount: data.targetAmount,
        savedAmount: data.savedAmount ?? 0,
        description: data.description,
        deadline: data.deadline,
        createdAt: now(),
        updatedAt: now(),
      };
      persist([...goals, newGoal]);
      return newGoal;
    },
    [goals, persist]
  );

  const updateGoal = useCallback(
    (id: string, data: Partial<GoalFormData>) => {
      const index = goals.findIndex((g) => g.id === id);
      if (index === -1) return;
      const current = goals[index];
      const updated: Goal = {
        ...current,
        ...data,
        id: current.id,
        savedAmount: data.savedAmount ?? current.savedAmount,
        createdAt: current.createdAt,
        updatedAt: now(),
      };
      if (updated.targetAmount < updated.savedAmount) return;
      const next = [...goals];
      next[index] = updated;
      persist(next);
    },
    [goals, persist]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      persist(goals.filter((g) => g.id !== id));
    },
    [goals, persist]
  );

  const addSaving = useCallback(
    (id: string, amount: number) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal || amount <= 0) return false;
      const newSaved = goal.savedAmount + amount;
      if (newSaved > goal.targetAmount) return false;
      updateGoal(id, { savedAmount: newSaved });
      return true;
    },
    [goals, updateGoal]
  );

  const getGoalById = useCallback(
    (id: string): Goal | undefined => goals.find((g) => g.id === id),
    [goals]
  );

  return {
    goals,
    initialized,
    addGoal,
    updateGoal,
    deleteGoal,
    addSaving,
    getGoalById,
  };
}
