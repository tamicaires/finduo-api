import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUseCase } from '@shared/protocols/use-case.interface';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ICoupleRepository } from '@core/domain/repositories/couple.repository';
import { LoggerService } from '@infra/logging/logger.service';
import { UnitOfWork } from '@infra/database/prisma/unit-of-work';
import { TransactionType } from '@core/enum/transaction-type.enum';
import { TransactionCategory } from '@core/enum/transaction-category.enum';
export interface RegisterTransactionInput {
    coupleId: string;
    userId: string;
    account_id: string;
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    description?: string;
    transaction_date?: Date;
    is_free_spending?: boolean;
}
export interface RegisterTransactionOutput {
    id: string;
    couple_id: string;
    account_id: string;
    type: TransactionType;
    amount: number;
    category: TransactionCategory;
    description: string | null;
    transaction_date: Date;
    is_free_spending: boolean;
    created_at: Date;
}
export declare class RegisterTransactionUseCase implements IUseCase<RegisterTransactionInput, RegisterTransactionOutput> {
    private readonly transactionRepository;
    private readonly accountRepository;
    private readonly coupleRepository;
    private readonly unitOfWork;
    private readonly eventEmitter;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository, coupleRepository: ICoupleRepository, unitOfWork: UnitOfWork, eventEmitter: EventEmitter2, logger: LoggerService);
    execute(input: RegisterTransactionInput): Promise<RegisterTransactionOutput>;
}
