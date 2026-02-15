# Saving Goal Tracker

A production-ready personal saving goal tracker web app built with React 18, TypeScript (strict), and MUI v5. Data is persisted in `localStorage` (no backend).

## Stack

- React 18
- TypeScript (strict mode)
- MUI v5
- Vite
- localStorage for persistence

## Features

- **Dashboard**: List of goals with progress bars (dynamic color: red &lt; 30%, orange 30–70%, green &gt; 70%)
- **Add/Edit Goal**: Icon (emoji), title, description, currency, target amount, optional deadline
- **Add Saving**: Per-goal amount input (cannot exceed target)
- **3-dot menu** on each card: Edit, Add Saving, Delete
- **Confirm dialog** before delete
- **Snackbar** for success/error
- **Dark mode** toggle with theme persisted in localStorage
- **Skeleton** loading and **empty state** when no goals
- **Mobile-first** responsive layout and FAB bottom-right

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/   GoalCard, GoalFormDialog, AddSavingDialog, ConfirmDialog
  pages/        Dashboard
  hooks/        useGoals
  storage/      goalStorage
  types/        goal
  utils/        currency, percentage
  contexts/      SnackbarContext
  theme.ts      MUI theme + dark mode
```

## Local storage keys

- `saving_goals_v1` – goals array
- `saving_goals_theme` – `"light"` | `"dark"`
