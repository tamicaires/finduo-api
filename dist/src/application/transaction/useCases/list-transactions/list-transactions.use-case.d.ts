import { IUseCase } from '@shared/protocols/use-case.interface';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
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
        user_id: string;
        type: TransactionType;
        amount: number;
        category: TransactionCategory;
        description: string | null;
        transaction_date: Date;
        is_free_spending: boolean;
        created_at: Date;
    }>;
    next_cursor: string | null;
}
export declare class ListTransactionsUseCase implements IUseCase<ListTransactionsInput, ListTransactionsOutput> {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository, logger: LoggerService);
    execute(input: ListTransactionsInput): Promise<ListTransactionsOutput>;
}
