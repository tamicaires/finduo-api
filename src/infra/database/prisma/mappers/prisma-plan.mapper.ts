import { Plan as PrismaPlan } from '@prisma/client';
import { Plan } from '@core/domain/entities/plan.entity';

/**
 * Prisma Plan Mapper
 *
 * Converts Prisma Decimal to number for price
 * Converts Prisma Json to Record<string, boolean> for features
 */
export class PrismaPlanMapper {
  static toDomain(prismaPlan: PrismaPlan): Plan {
    return new Plan({
      id: prismaPlan.id,
      name: prismaPlan.name,
      price_monthly: Number(prismaPlan.price_monthly),
      max_accounts: prismaPlan.max_accounts,
      max_transactions_month: prismaPlan.max_transactions_month,
      features: (prismaPlan.features as Record<string, boolean>) || {},
      created_at: prismaPlan.created_at,
    });
  }

  static toPrisma(plan: Plan): Omit<PrismaPlan, 'created_at'> {
    return {
      id: plan.id,
      name: plan.name,
      price_monthly: plan.price_monthly,
      max_accounts: plan.max_accounts,
      max_transactions_month: plan.max_transactions_month,
      features: plan.features as any, // Prisma Json type
    };
  }
}
