"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoupleModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../infra/database/database.module");
const logging_module_1 = require("../../infra/logging/logging.module");
const create_couple_use_case_1 = require("./useCases/create-couple/create-couple.use-case");
const get_couple_dashboard_use_case_1 = require("./useCases/get-couple-dashboard/get-couple-dashboard.use-case");
const update_free_spending_use_case_1 = require("./useCases/update-free-spending/update-free-spending.use-case");
const prisma_couple_repository_1 = require("../../infra/database/prisma/repositories/prisma-couple.repository");
const prisma_account_repository_1 = require("../../infra/database/prisma/repositories/prisma-account.repository");
const prisma_transaction_repository_1 = require("../../infra/database/prisma/repositories/prisma-transaction.repository");
const prisma_subscription_repository_1 = require("../../infra/database/prisma/repositories/prisma-subscription.repository");
const prisma_plan_repository_1 = require("../../infra/database/prisma/repositories/prisma-plan.repository");
let CoupleModule = class CoupleModule {
};
exports.CoupleModule = CoupleModule;
exports.CoupleModule = CoupleModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, logging_module_1.LoggingModule],
        providers: [
            create_couple_use_case_1.CreateCoupleUseCase,
            get_couple_dashboard_use_case_1.GetCoupleDashboardUseCase,
            update_free_spending_use_case_1.UpdateFreeSpendingUseCase,
            {
                provide: 'ICoupleRepository',
                useClass: prisma_couple_repository_1.PrismaCoupleRepository,
            },
            {
                provide: 'IAccountRepository',
                useClass: prisma_account_repository_1.PrismaAccountRepository,
            },
            {
                provide: 'ITransactionRepository',
                useClass: prisma_transaction_repository_1.PrismaTransactionRepository,
            },
            {
                provide: 'ISubscriptionRepository',
                useClass: prisma_subscription_repository_1.PrismaSubscriptionRepository,
            },
            {
                provide: 'IPlanRepository',
                useClass: prisma_plan_repository_1.PrismaPlanRepository,
            },
        ],
        exports: [
            create_couple_use_case_1.CreateCoupleUseCase,
            get_couple_dashboard_use_case_1.GetCoupleDashboardUseCase,
            update_free_spending_use_case_1.UpdateFreeSpendingUseCase,
        ],
    })
], CoupleModule);
//# sourceMappingURL=couple.module.js.map