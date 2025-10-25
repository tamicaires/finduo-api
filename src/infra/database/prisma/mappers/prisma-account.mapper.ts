import { Account as PrismaAccount } from '@prisma/client';
import { Account } from '@core/domain/entities/account.entity';

/**
 * Prisma Account Mapper
 *
 * Converts Prisma Decimal to number for balance
 */
export class PrismaAccountMapper {
  static toDomain(prismaAccount: PrismaAccount): Account {
    return new Account({
      id: prismaAccount.id,
      couple_id: prismaAccount.couple_id,
      owner_id: prismaAccount.owner_id,
      name: prismaAccount.name,
      current_balance: Number(prismaAccount.current_balance),
      created_at: prismaAccount.created_at,
      updated_at: prismaAccount.updated_at,
    });
  }

  static toPrisma(account: Account): Omit<PrismaAccount, 'created_at' | 'updated_at'> {
    return {
      id: account.id,
      couple_id: account.couple_id,
      owner_id: account.owner_id,
      name: account.name,
      current_balance: account.current_balance,
    };
  }
}
