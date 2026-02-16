import { useState, useCallback } from 'react';
import type { Goal, GoalFormData, SavingTransaction, SavingTransactionType } from '../types/goal';
import { getGoals, saveGoals } from '../storage/goalStorage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function loadGoals(): Goal[] {
  return getGoals().map((g) => ({
    ...g,
    transactions: g.transactions ?? [],
  }));
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals);
  const initialized = true;

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
        iconColor: data.iconColor,
        currency: data.currency,
        targetAmount: data.targetAmount,
        savedAmount: data.savedAmount ?? 0,
        description: data.description,
        deadline: data.deadline,
        createdAt: now(),
        updatedAt: now(),
        transactions: [],
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
    (id: string, amount: number, type: SavingTransactionType) => {
      const index = goals.findIndex((g) => g.id === id);
      if (index === -1 || amount <= 0) return false;
      const goal = goals[index];
      const transactions = goal.transactions ?? [];
      const delta = type === 'debit' ? amount : -amount;
      let newSaved = goal.savedAmount + delta;
      if (type === 'debit' && newSaved > goal.targetAmount) return false;
      if (type === 'credit' && newSaved < 0) return false;
      newSaved = Math.max(0, Math.min(goal.targetAmount, newSaved));
      const tx: SavingTransaction = {
        id: generateId(),
        amount,
        type,
        date: now(),
      };
      const next = [...goals];
      next[index] = {
        ...goal,
        savedAmount: newSaved,
        updatedAt: now(),
        transactions: [...transactions, tx],
      };
      persist(next);
      return true;
    },
    [goals, persist]
  );

  const getGoalById = useCallback(
    (id: string): Goal | undefined => goals.find((g) => g.id === id),
    [goals]
  );

  const moveGoalUp = useCallback(
    (id: string) => {
      const index = goals.findIndex((g) => g.id === id);
      if (index <= 0) return;
      const next = [...goals];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      persist(next);
    },
    [goals, persist]
  );

  const moveGoalDown = useCallback(
    (id: string) => {
      const index = goals.findIndex((g) => g.id === id);
      if (index === -1 || index >= goals.length - 1) return;
      const next = [...goals];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      persist(next);
    },
    [goals, persist]
  );

  const reorderGoals = useCallback(
    (orderedIds: string[]) => {
      const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
      const next = [...goals].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      persist(next);
    },
    [goals, persist]
  );

  const refresh = useCallback(() => {
    setGoals(loadGoals());
  }, []);

  return {
    goals,
    initialized,
    addGoal,
    updateGoal,
    deleteGoal,
    addSaving,
    getGoalById,
    moveGoalUp,
    moveGoalDown,
    reorderGoals,
    refresh,
  };
}
