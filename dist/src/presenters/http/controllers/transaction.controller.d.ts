import { RegisterTransactionUseCase } from '@application/transaction/useCases/register-transaction/register-transaction.use-case';
import { ListTransactionsUseCase } from '@application/transaction/useCases/list-transactions/list-transactions.use-case';
import { DeleteTransactionUseCase } from '@application/transaction/useCases/delete-transaction/delete-transaction.use-case';
import { RegisterTransactionDto } from '../dtos/transaction/register-transaction.dto';
import { AuthenticatedUser } from '@shared/types/authenticated-user.type';
export declare class TransactionController {
    private readonly registerTransactionUseCase;
    private readonly listTransactionsUseCase;
    private readonly deleteTransactionUseCase;
    constructor(registerTransactionUseCase: RegisterTransactionUseCase, listTransactionsUseCase: ListTransactionsUseCase, deleteTransactionUseCase: DeleteTransactionUseCase);
    registerTransaction(coupleId: string, user: AuthenticatedUser, dto: RegisterTransactionDto): Promise<import("@application/transaction/useCases/register-transaction/register-transaction.use-case").RegisterTransactionOutput>;
    listTransactions(coupleId: string, limit?: number, cursor?: string): Promise<import("@application/transaction/useCases/list-transactions/list-transactions.use-case").ListTransactionsOutput>;
    deleteTransaction(coupleId: string, transactionId: string): Promise<import("@application/transaction/useCases/delete-transaction/delete-transaction.use-case").DeleteTransactionOutput>;
}
