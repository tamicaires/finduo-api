import { Transaction as PrismaTransaction, TransactionType as PrismaTransactionType } from '@prisma/client';
import { Transaction } from '@core/domain/entities/transaction.entity';
import { TransactionType } from '@core/enum/transaction-type.enum';

/**
 * Prisma Transaction Mapper
 *
 * Converts Prisma Decimal to number for amount
 */
export class PrismaTransactionMapper {
  static toDomain(prismaTransaction: PrismaTransaction): Transaction {
    return new Transaction({
      id: prismaTransaction.id,
      couple_id: prismaTransaction.couple_id,
      type: prismaTransaction.type as TransactionType,
      amount: Number(prismaTransaction.amount),
      description: prismaTransaction.description,
      paid_by_id: prismaTransaction.paid_by_id,
      account_id: prismaTransaction.account_id,
      is_couple_expense: prismaTransaction.is_couple_expense,
      category: prismaTransaction.category,
      transaction_date: prismaTransaction.transaction_date,
      created_at: prismaTransaction.created_at,
    });
  }

  static toPrisma(transaction: Transaction): Omit<PrismaTransaction, 'created_at'> {
    return {
      id: transaction.id,
      couple_id: transaction.couple_id,
      type: transaction.type as PrismaTransactionType,
      amount: transaction.amount,
      description: transaction.description,
      paid_by_id: transaction.paid_by_id,
      account_id: transaction.account_id,
      is_couple_expense: transaction.is_couple_expense,
      category: transaction.category,
      transaction_date: transaction.transaction_date,
    };
  }
}
