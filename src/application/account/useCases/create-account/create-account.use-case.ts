import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/protocols/use-case.interface';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ISubscriptionRepository } from '@core/domain/repositories/subscription.repository';
import { IPlanRepository } from '@core/domain/repositories/plan.repository';
import { Account } from '@core/domain/entities/account.entity';
// import { AccountLimitReachedException } from '@core/exceptions/account/account-limit-reached.exception';
import { SubscriptionInactiveException } from '@core/exceptions/subscription/subscription-inactive.exception';
import { LoggerService } from '@infra/logging/logger.service';
import { AccountType } from '@core/enum/account-type.enum';

export interface CreateAccountInput {
  coupleId: string;
  name: string;
  type: AccountType;
  initial_balance?: number;
}

export interface CreateAccountOutput {
  id: string;
  couple_id: string;
  name: string;
  type: AccountType;
  balance: number;
  created_at: Date;
}

/**
 * Create Account Use Case
 *
 * Creates a financial account for the couple
 *
 * Business Rules:
 * - Couple must have an active subscription
 * - FREE plan: max 2 accounts
 * - PREMIUM plan: unlimited accounts
 * - Initial balance defaults to 0
 */
@Injectable()
export class CreateAccountUseCase implements IUseCase<CreateAccountInput, CreateAccountOutput> {
  // private readonly FREE_PLAN_ACCOUNT_LIMIT = 2;

  constructor(
    @Inject('IAccountRepository')

    private readonly accountRepository: IAccountRepository,
    @Inject('ISubscriptionRepository')

    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject('IPlanRepository')

    private readonly planRepository: IPlanRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    this.logger.logUseCase('CreateAccountUseCase', {
      coupleId: input.coupleId,
      name: input.name,
      type: input.type,
    });

    // Check subscription status
    const subscription = await this.subscriptionRepository.findActiveByCoupleId(input.coupleId);
    if (!subscription) {
      throw new SubscriptionInactiveException();
    }

    // Get plan details (not used for now - all plans are premium)
    // const plan = await this.planRepository.findById(subscription.plan_id);

    // Check account limit (FREE plan only) - DISABLED FOR PREMIUM
    // if (plan && plan.isFree()) {
    //   const existingAccounts = await this.accountRepository.findByCoupleId(input.coupleId);
    //   if (existingAccounts.length >= this.FREE_PLAN_ACCOUNT_LIMIT) {
    //     throw new AccountLimitReachedException(this.FREE_PLAN_ACCOUNT_LIMIT);
    //   }
    // }

    // Create account
    const account = new Account({
      couple_id: input.coupleId,
      name: input.name,
      type: input.type,
      current_balance: input.initial_balance || 0,
    });

    const created = await this.accountRepository.create(account);

    this.logger.log('Account created successfully', {
      accountId: created.id,
      coupleId: input.coupleId,
      type: input.type,
    });

    return {
      id: created.id,
      couple_id: created.couple_id,
      name: created.name,
      type: created.type,
      balance: created.balance,
      created_at: created.created_at,
    };
  }
}
