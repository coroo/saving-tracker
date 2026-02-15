export type SavingTransactionType = 'debit' | 'credit';

export interface SavingTransaction {
  id: string;
  amount: number;
  type: SavingTransactionType;
  date: string;
  note?: string;
}

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
  transactions?: SavingTransaction[];
}

export type GoalFormData = Omit<
  Goal,
  'id' | 'savedAmount' | 'createdAt' | 'updatedAt'
> & {
  savedAmount?: number;
};
