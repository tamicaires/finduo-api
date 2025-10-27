import { Module } from '@nestjs/common';
import { AuthModule } from '@application/auth/auth.module';
import { CoupleModule } from '@application/couple/couple.module';
import { AccountModule } from '@application/account/account.module';
import { TransactionModule } from '@application/transaction/transaction.module';
import { CategoryModule } from '@application/category/category.module';

// Controllers
import { AuthController } from './http/controllers/auth.controller';
import { CoupleController } from './http/controllers/couple.controller';
import { AccountController } from './http/controllers/account.controller';
import { TransactionController } from './http/controllers/transaction.controller';
import { CategoryController } from './http/controllers/category.controller';

@Module({
  imports: [
    AuthModule,
    CoupleModule,
    AccountModule,
    TransactionModule,
    CategoryModule,
  ],
  controllers: [
    AuthController,
    CoupleController,
    AccountController,
    TransactionController,
    CategoryController,
  ],
})
export class PresenterModule {}
