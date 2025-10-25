import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';

// Use Cases
import { CreateCoupleUseCase } from './useCases/create-couple/create-couple.use-case';
import { GetCoupleDashboardUseCase } from './useCases/get-couple-dashboard/get-couple-dashboard.use-case';
import { UpdateFreeSpendingUseCase } from './useCases/update-free-spending/update-free-spending.use-case';

// Repositories
import { PrismaCoupleRepository } from '@infra/database/prisma/repositories/prisma-couple.repository';
import { PrismaAccountRepository } from '@infra/database/prisma/repositories/prisma-account.repository';
import { PrismaTransactionRepository } from '@infra/database/prisma/repositories/prisma-transaction.repository';
import { PrismaSubscriptionRepository } from '@infra/database/prisma/repositories/prisma-subscription.repository';
import { PrismaPlanRepository } from '@infra/database/prisma/repositories/prisma-plan.repository';
import { ICoupleRepository } from '@core/domain/repositories/couple.repository';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ITransactionRepository } from '@core/domain/repositories/transaction.repository';
import { ISubscriptionRepository } from '@core/domain/repositories/subscription.repository';
import { IPlanRepository } from '@core/domain/repositories/plan.repository';

@Module({
  imports: [DatabaseModule, LoggingModule],
  providers: [
    // Use Cases
    CreateCoupleUseCase,
    GetCoupleDashboardUseCase,
    UpdateFreeSpendingUseCase,

    // Repositories
    {
      provide: 'ICoupleRepository',
      useClass: PrismaCoupleRepository,
    },
    {
      provide: ICoupleRepository,
      useExisting: 'ICoupleRepository',
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
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: ITransactionRepository,
      useExisting: 'ITransactionRepository',
    },
    {
      provide: 'ISubscriptionRepository',
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: ISubscriptionRepository,
      useExisting: 'ISubscriptionRepository',
    },
    {
      provide: 'IPlanRepository',
      useClass: PrismaPlanRepository,
    },
    {
      provide: IPlanRepository,
      useExisting: 'IPlanRepository',
    },
  ],
  exports: [
    CreateCoupleUseCase,
    GetCoupleDashboardUseCase,
    UpdateFreeSpendingUseCase,
  ],
})
export class CoupleModule {}
