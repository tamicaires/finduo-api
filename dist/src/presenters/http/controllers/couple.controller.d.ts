import { CreateCoupleUseCase } from '@application/couple/useCases/create-couple/create-couple.use-case';
import { GetCoupleDashboardUseCase } from '@application/couple/useCases/get-couple-dashboard/get-couple-dashboard.use-case';
import { UpdateFreeSpendingUseCase } from '@application/couple/useCases/update-free-spending/update-free-spending.use-case';
import { CreateCoupleDto } from '../dtos/couple/create-couple.dto';
import { UpdateFreeSpendingDto } from '../dtos/couple/update-free-spending.dto';
import { AuthenticatedUser } from '@shared/types/authenticated-user.type';
export declare class CoupleController {
    private readonly createCoupleUseCase;
    private readonly getCoupleDashboardUseCase;
    private readonly updateFreeSpendingUseCase;
    constructor(createCoupleUseCase: CreateCoupleUseCase, getCoupleDashboardUseCase: GetCoupleDashboardUseCase, updateFreeSpendingUseCase: UpdateFreeSpendingUseCase);
    createCouple(dto: CreateCoupleDto): Promise<import("@application/couple/useCases/create-couple/create-couple.use-case").CreateCoupleOutput>;
    getDashboard(coupleId: string, user: AuthenticatedUser): Promise<import("@application/couple/useCases/get-couple-dashboard/get-couple-dashboard.use-case").GetCoupleDashboardOutput>;
    updateFreeSpending(coupleId: string, user: AuthenticatedUser, dto: UpdateFreeSpendingDto): Promise<import("@application/couple/useCases/update-free-spending/update-free-spending.use-case").UpdateFreeSpendingOutput>;
}
