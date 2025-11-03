import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';

// Use Cases
import { RegisterTransactionUseCase } from './useCases/register-transaction/register-transaction.use-case';
import { ListTransactionsUseCase } from './useCases/list-transactions/list-transactions.use-case';
import { DeleteTransactionUseCase } from './useCases/delete-transaction/delete-transaction.use-case';
import { UpdateFreeSpendingUseCase } from './useCases/update-free-spending/update-free-spending.use-case';

// Repositories
import { PrismaTransactionRepository } from '@infra/database/prisma/repositories/prisma-transaction.repository';
import { PrismaAccountRepository } from '@infra/database/prisma/repositories/prisma-account.repository';
import { PrismaCoupleRepository } from '@infra/database/prisma/repositories/prisma-couple.repository';

@Module({
  imports: [DatabaseModule, LoggingModule, EventEmitterModule],
  providers: [
    // Use Cases
    RegisterTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateFreeSpendingUseCase,

    // Repositories
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'IAccountRepository',
      useClass: PrismaAccountRepository,
    },
    {
      provide: 'ICoupleRepository',
      useClass: PrismaCoupleRepository,
    },
  ],
  exports: [
    RegisterTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    UpdateFreeSpendingUseCase,
  ],
})
export class TransactionModule {}
