"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../infra/database/database.module");
const logging_module_1 = require("../../infra/logging/logging.module");
const create_account_use_case_1 = require("./useCases/create-account/create-account.use-case");
const list_accounts_use_case_1 = require("./useCases/list-accounts/list-accounts.use-case");
const update_account_use_case_1 = require("./useCases/update-account/update-account.use-case");
const delete_account_use_case_1 = require("./useCases/delete-account/delete-account.use-case");
const prisma_account_repository_1 = require("../../infra/database/prisma/repositories/prisma-account.repository");
const prisma_subscription_repository_1 = require("../../infra/database/prisma/repositories/prisma-subscription.repository");
const prisma_plan_repository_1 = require("../../infra/database/prisma/repositories/prisma-plan.repository");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, logging_module_1.LoggingModule],
        providers: [
            create_account_use_case_1.CreateAccountUseCase,
            list_accounts_use_case_1.ListAccountsUseCase,
            update_account_use_case_1.UpdateAccountUseCase,
            delete_account_use_case_1.DeleteAccountUseCase,
            {
                provide: 'IAccountRepository',
                useClass: prisma_account_repository_1.PrismaAccountRepository,
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
            create_account_use_case_1.CreateAccountUseCase,
            list_accounts_use_case_1.ListAccountsUseCase,
            update_account_use_case_1.UpdateAccountUseCase,
            delete_account_use_case_1.DeleteAccountUseCase,
        ],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map