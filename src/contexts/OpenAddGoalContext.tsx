import { createContext, useCallback, useRef, useMemo, type ReactNode } from 'react';

type OpenAddGoalFn = () => void;

const noop: OpenAddGoalFn = () => {};

const OpenAddGoalContext = createContext<{
  openAddGoal: OpenAddGoalFn;
  register: (fn: OpenAddGoalFn) => () => void;
}>({ openAddGoal: noop, register: () => () => {} });

export { OpenAddGoalContext };

export function OpenAddGoalProvider({ children }: { children: ReactNode }) {
  const ref = useRef<OpenAddGoalFn>(noop);

  const openAddGoal = useCallback(() => {
    ref.current();
  }, []);

  const register = useCallback((fn: OpenAddGoalFn) => {
    ref.current = fn;
    return () => {
      ref.current = noop;
    };
  }, []);

  const value = useMemo(() => ({ openAddGoal, register }), [openAddGoal, register]);

  return (
    <OpenAddGoalContext.Provider value={value}>
      {children}
    </OpenAddGoalContext.Provider>
  );
}
