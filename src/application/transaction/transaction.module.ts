import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';

// Use Cases
import { RegisterTransactionUseCase } from './useCases/register-transaction/register-transaction.use-case';
import { ListTransactionsUseCase } from './useCases/list-transactions/list-transactions.use-case';
import { DeleteTransactionUseCase } from './useCases/delete-transaction/delete-transaction.use-case';

// Repositories
import { PrismaTransactionRepository } from '@infra/database/prisma/repositories/prisma-transaction.repository';
import { PrismaAccountRepository } from '@infra/database/prisma/repositories/prisma-account.repository';
import { PrismaCoupleRepository } from '@infra/database/prisma/repositories/prisma-couple.repository';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ICoupleRepository } from '@core/domain/repositories/couple.repository';

@Module({
  imports: [DatabaseModule, LoggingModule, EventEmitterModule],
  providers: [
    // Use Cases
    RegisterTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,

    // Repositories
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: ITransactionRepository,
      useExisting: 'ITransactionRepository',
    },
    {
      provide: 'IAccountRepository',
      useClass: PrismaAccountRepository,
    },
    {
      provide: IAccountRepository,
      useExisting: 'IAccountRepository',
    },
    {
      provide: 'ICoupleRepository',
      useClass: PrismaCoupleRepository,
    },
    {
      provide: ICoupleRepository,
      useExisting: 'ICoupleRepository',
    },
  ],
  exports: [
    RegisterTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
  ],
})
export class TransactionModule {}
