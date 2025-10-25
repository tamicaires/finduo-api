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
      provide: 'ISubscriptionRepository',
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: 'IPlanRepository',
      useClass: PrismaPlanRepository,
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
