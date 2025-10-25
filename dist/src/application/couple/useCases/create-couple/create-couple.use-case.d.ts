import { IUseCase } from '@shared/protocols/use-case.interface';
import { ICoupleRepository } from '@core/domain/repositories/couple.repository';
import { ISubscriptionRepository } from '@core/domain/repositories/subscription.repository';
import { IPlanRepository } from '@core/domain/repositories/plan.repository';
import { UnitOfWork } from '@infra/database/prisma/unit-of-work';
import { LoggerService } from '@infra/logging/logger.service';
import { SubscriptionStatus } from '@core/enum/subscription-status.enum';
export interface CreateCoupleInput {
    user_id_a: string;
    user_id_b: string;
    free_spending_a_monthly: number;
    free_spending_b_monthly: number;
    reset_day?: number;
}
export interface CreateCoupleOutput {
    couple: {
        id: string;
        user_id_a: string;
        user_id_b: string;
        free_spending_a_monthly: number;
        free_spending_b_monthly: number;
        reset_day: number;
        created_at: Date;
    };
    subscription: {
        id: string;
        plan_name: string;
        status: SubscriptionStatus;
        trial_days: number | null;
    };
}
export declare class CreateCoupleUseCase implements IUseCase<CreateCoupleInput, CreateCoupleOutput> {
    private readonly coupleRepository;
    private readonly subscriptionRepository;
    private readonly planRepository;
    private readonly unitOfWork;
    private readonly logger;
    private readonly TRIAL_DAYS;
    constructor(coupleRepository: ICoupleRepository, subscriptionRepository: ISubscriptionRepository, planRepository: IPlanRepository, unitOfWork: UnitOfWork, logger: LoggerService);
    execute(input: CreateCoupleInput): Promise<CreateCoupleOutput>;
}
