import { randomUUID } from 'crypto';
import { z } from 'zod';
import { TransactionType } from '@core/enum/transaction-type.enum';
import { TransactionVisibility } from '@core/enum/transaction-visibility.enum';

export class Transaction {
  id: string;
  couple_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  paid_by_id: string;
  account_id: string;
  is_free_spending: boolean;
  is_couple_expense: boolean;
  visibility: TransactionVisibility;
  category: string | null;
  transaction_date: Date;
  created_at: Date;

  constructor(data: TransactionEntityType) {
    const validatedData = transactionSchema.parse(data);
    Object.assign(this, validatedData);
    this.id = validatedData.id ?? randomUUID();
    this.transaction_date = validatedData.transaction_date ?? new Date();
    this.created_at = validatedData.created_at ?? new Date();
  }

  // Helper: Check if it's an expense
  isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }

  // Helper: Check if it's an income
  isIncome(): boolean {
    return this.type === TransactionType.INCOME;
  }

  // Helper: Check if it affects free spending
  affectsFreeSpending(): boolean {
    return this.isExpense() && !this.is_couple_expense;
  }

  // Helper: Get formatted amount with currency
  getFormattedAmount(): string {
    return `R$ ${this.amount.toFixed(2)}`;
  }

  // Helper: Get transaction type label
  getTypeLabel(): string {
    return this.isIncome() ? 'Income' : 'Expense';
  }

  // Helper: Get expense type label
  getExpenseTypeLabel(): string {
    if (!this.isExpense()) return '-';
    return this.is_couple_expense ? 'Joint Expense' : 'Individual Expense';
  }
}

export const transactionSchema = z.object({
  id: z.string().uuid().optional(),
  couple_id: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive(),
  description: z.string().nullable().optional(),
  paid_by_id: z.string().uuid(),
  account_id: z.string().uuid(),
  is_free_spending: z.boolean().default(false),
  is_couple_expense: z.boolean().default(false),
  visibility: z.nativeEnum(TransactionVisibility).default(TransactionVisibility.SHARED),
  category: z.string().nullable().optional(),
  transaction_date: z.date().optional(),
  created_at: z.date().optional(),
});

export type TransactionEntityType = z.infer<typeof transactionSchema>;
