import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';

// Use Cases
import { CreateAccountUseCase } from './useCases/create-account/create-account.use-case';
import { ListAccountsUseCase } from './useCases/list-accounts/list-accounts.use-case';
import { UpdateAccountUseCase } from './useCases/update-account/update-account.use-case';
import { DeleteAccountUseCase } from './useCases/delete-account/delete-account.use-case';

// Repositories
import { PrismaAccountRepository } from '@infra/database/prisma/repositories/prisma-account.repository';
import { PrismaSubscriptionRepository } from '@infra/database/prisma/repositories/prisma-subscription.repository';
import { PrismaPlanRepository } from '@infra/database/prisma/repositories/prisma-plan.repository';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ISubscriptionRepository } from '@core/domain/repositories/subscription.repository';
import { IPlanRepository } from '@core/domain/repositories/plan.repository';

@Module({
  imports: [DatabaseModule, LoggingModule],
  providers: [
    // Use Cases
    CreateAccountUseCase,
    ListAccountsUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,

    // Repositories
    {
      provide: 'IAccountRepository',
      useClass: PrismaAccountRepository,
    },
    {
      provide: IAccountRepository,
      useExisting: 'IAccountRepository',
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
    CreateAccountUseCase,
    ListAccountsUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
  ],
})
export class AccountModule {}
