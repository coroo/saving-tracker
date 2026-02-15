export interface Goal {
  id: string;
  title: string;
  icon: string;
  currency: string;
  targetAmount: number;
  savedAmount: number;
  description?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalFormData = Omit<
  Goal,
  'id' | 'savedAmount' | 'createdAt' | 'updatedAt'
> & {
  savedAmount?: number;
};
