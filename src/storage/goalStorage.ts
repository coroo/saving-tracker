import type { Goal } from '../types/goal';

const STORAGE_KEY = 'saving_goals_v1';

function isGoalArray(value: unknown): value is Goal[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Goal).id === 'string' &&
      typeof (item as Goal).title === 'string' &&
      typeof (item as Goal).icon === 'string' &&
      typeof (item as Goal).currency === 'string' &&
      typeof (item as Goal).targetAmount === 'number' &&
      typeof (item as Goal).savedAmount === 'number' &&
      typeof (item as Goal).createdAt === 'string' &&
      typeof (item as Goal).updatedAt === 'string'
    );
  });
}

export function getGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isGoalArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {
    // Storage full or disabled; fail silently or could notify
  }
}
