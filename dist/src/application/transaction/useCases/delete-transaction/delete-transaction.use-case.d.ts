import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUseCase } from '@shared/protocols/use-case.interface';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { LoggerService } from '@infra/logging/logger.service';
import { UnitOfWork } from '@infra/database/prisma/unit-of-work';
export interface DeleteTransactionInput {
    coupleId: string;
    transactionId: string;
}
export interface DeleteTransactionOutput {
    success: boolean;
    deleted_transaction_id: string;
}
export declare class DeleteTransactionUseCase implements IUseCase<DeleteTransactionInput, DeleteTransactionOutput> {
    private readonly transactionRepository;
    private readonly accountRepository;
    private readonly unitOfWork;
    private readonly eventEmitter;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository, unitOfWork: UnitOfWork, eventEmitter: EventEmitter2, logger: LoggerService);
    execute(input: DeleteTransactionInput): Promise<DeleteTransactionOutput>;
}
