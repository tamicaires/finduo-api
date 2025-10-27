import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUseCase } from '@shared/protocols/use-case.interface';
import { IAccountRepository } from '@core/domain/repositories/account.repository';
import { ICoupleRepository } from '@core/domain/repositories/couple.repository';
import { Transaction } from '@core/domain/entities/transaction.entity';
import { AccountNotFoundException } from '@core/exceptions/account/account-not-found.exception';
import { CoupleNotFoundException } from '@core/exceptions/couple/couple-not-found.exception';
import { InsufficientFreeSpendingException } from '@core/exceptions/transaction/insufficient-free-spending.exception';
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

/**
 * Register Transaction Use Case
 *
 * Registers a financial transaction and updates balances
 *
 * Business Rules:
 * - INCOME: Increases account balance
 * - EXPENSE: Decreases account balance
 * - If EXPENSE + is_free_spending: deducts from user's free spending
 * - If free spending insufficient: throws exception
 * - All operations in a single transaction (atomicity)
 * - Emits TransactionRegisteredEvent for reactive logic
 */
@Injectable()
export class RegisterTransactionUseCase
  implements IUseCase<RegisterTransactionInput, RegisterTransactionOutput>
{
  constructor(
    @Inject('IAccountRepository')

    private readonly accountRepository: IAccountRepository,
    @Inject('ICoupleRepository')

    private readonly coupleRepository: ICoupleRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  async execute(input: RegisterTransactionInput): Promise<RegisterTransactionOutput> {
    this.logger.logUseCase('RegisterTransactionUseCase', {
      coupleId: input.coupleId,
      userId: input.userId,
      type: input.type,
      amount: input.amount,
    });

    // Validate account exists
    const account = await this.accountRepository.findById(input.account_id);
    if (!account) {
      throw new AccountNotFoundException(input.account_id);
    }

    // Validate couple exists
    const couple = await this.coupleRepository.findById(input.coupleId);
    if (!couple) {
      throw new CoupleNotFoundException(input.coupleId);
    }

    // Check free spending if applicable
    if (input.type === TransactionType.EXPENSE && input.is_free_spending) {
      const isUserA = couple.isUserA(input.userId);
      const freeSpendingRemaining = isUserA
        ? couple.free_spending_a_remaining
        : couple.free_spending_b_remaining;

      if (freeSpendingRemaining < input.amount) {
        throw new InsufficientFreeSpendingException(freeSpendingRemaining);
      }
    }

    // Execute transaction atomically
    const result = await this.unitOfWork.execute(async (prisma) => {
      // Create transaction
      const transaction = new Transaction({
        couple_id: input.coupleId,
        account_id: input.account_id,
        paid_by_id: input.userId,
        type: input.type,
        amount: input.amount,
        category: input.category,
        description: input.description || null,
        transaction_date: input.transaction_date || new Date(),
        is_free_spending: input.is_free_spending || false,
        is_couple_expense: false,
      });

      const createdTransaction = await prisma.transaction.create({
        data: {
          id: transaction.id,
          couple_id: transaction.couple_id,
          account_id: transaction.account_id,
          paid_by_id: transaction.paid_by_id,
          type: transaction.type,
          amount: transaction.amount,
          category_id: transaction.category,
          description: transaction.description,
          transaction_date: transaction.transaction_date,
          is_free_spending: transaction.is_free_spending,
          is_couple_expense: transaction.is_couple_expense,
        },
      });

      // Update account balance
      const balanceChange = input.type === TransactionType.INCOME ? input.amount : -input.amount;
      await prisma.account.update({
        where: { id: input.account_id },
        data: {
          current_balance: {
            increment: balanceChange,
          },
        },
      });

      // Update free spending if applicable
      if (input.type === TransactionType.EXPENSE && input.is_free_spending) {
        const isUserA = couple.isUserA(input.userId);
        await prisma.couple.update({
          where: { id: input.coupleId },
          data: isUserA
            ? { free_spending_a_remaining: { decrement: input.amount } }
            : { free_spending_b_remaining: { decrement: input.amount } },
        });
      }

      return createdTransaction;
    });

    // Emit event for reactive logic
    this.eventEmitter.emit('transaction.registered', {
      transactionId: result.id,
      coupleId: input.coupleId,
      userId: input.userId,
      type: input.type,
      amount: input.amount,
      is_free_spending: input.is_free_spending,
    });

    this.logger.log('Transaction registered successfully', {
      transactionId: result.id,
      coupleId: input.coupleId,
      type: input.type,
      amount: input.amount,
    });

    return {
      id: result.id,
      couple_id: result.couple_id,
      account_id: result.account_id,
      type: result.type as TransactionType,
      amount: Number(result.amount),
      category: result.category_id as TransactionCategory,
      description: result.description,
      transaction_date: result.transaction_date,
      is_free_spending: result.is_free_spending,
      created_at: result.created_at,
    };
  }
}
