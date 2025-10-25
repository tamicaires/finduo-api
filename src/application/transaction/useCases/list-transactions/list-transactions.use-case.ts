import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/protocols/use-case.interface';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
import { Transaction } from '@core/domain/entities/transaction.entity';
import { LoggerService } from '@infra/logging/logger.service';
import { TransactionType } from '@core/enum/transaction-type.enum';
import { TransactionCategory } from '@core/enum/transaction-category.enum';

export interface ListTransactionsInput {
  coupleId: string;
  limit?: number;
  cursor?: string;
  filters?: {
    type?: TransactionType;
    category?: TransactionCategory;
    is_free_spending?: boolean;
    start_date?: Date;
    end_date?: Date;
  };
}

export interface ListTransactionsOutput {
  transactions: Array<{
    id: string;
    account_id: string;
    paid_by_id: string;
    type: TransactionType;
    amount: number;
    category: string | null;
    description: string | null;
    transaction_date: Date;
    is_free_spending: boolean;
    is_couple_expense: boolean;
    created_at: Date;
  }>;
  nextCursor: string | null;
}

/**
 * List Transactions Use Case
 *
 * Returns paginated list of transactions for the couple
 *
 * Business Rules:
 * - Only returns transactions for the specified couple (tenant isolation)
 * - Supports cursor-based pagination for performance
 * - Supports filtering by type, category, date range, free spending
 * - Ordered by transaction_date DESC (newest first)
 */
@Injectable()
export class ListTransactionsUseCase
  implements IUseCase<ListTransactionsInput, ListTransactionsOutput>
{
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(input: ListTransactionsInput): Promise<ListTransactionsOutput> {
    this.logger.logUseCase('ListTransactionsUseCase', {
      coupleId: input.coupleId,
      limit: input.limit,
    });

    // Get transactions with pagination
    const result = await this.transactionRepository.findByFilters(
      {
        coupleId: input.coupleId,
        ...input.filters,
      },
      {
        limit: input.limit || 50,
        cursor: input.cursor,
      },
    );

    return {
      transactions: result.data.map((tx: Transaction) => ({
        id: tx.id,
        account_id: tx.account_id,
        paid_by_id: tx.paid_by_id,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        transaction_date: tx.transaction_date,
        is_free_spending: tx.is_free_spending,
        is_couple_expense: tx.is_couple_expense,
        created_at: tx.created_at,
      })),
      nextCursor: result.nextCursor,
    };
  }
}
