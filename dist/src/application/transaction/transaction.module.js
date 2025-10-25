"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const database_module_1 = require("../../infra/database/database.module");
const logging_module_1 = require("../../infra/logging/logging.module");
const register_transaction_use_case_1 = require("./useCases/register-transaction/register-transaction.use-case");
const list_transactions_use_case_1 = require("./useCases/list-transactions/list-transactions.use-case");
const delete_transaction_use_case_1 = require("./useCases/delete-transaction/delete-transaction.use-case");
const prisma_transaction_repository_1 = require("../../infra/database/prisma/repositories/prisma-transaction.repository");
const prisma_account_repository_1 = require("../../infra/database/prisma/repositories/prisma-account.repository");
const prisma_couple_repository_1 = require("../../infra/database/prisma/repositories/prisma-couple.repository");
let TransactionModule = class TransactionModule {
};
exports.TransactionModule = TransactionModule;
exports.TransactionModule = TransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, logging_module_1.LoggingModule, event_emitter_1.EventEmitterModule],
        providers: [
            register_transaction_use_case_1.RegisterTransactionUseCase,
            list_transactions_use_case_1.ListTransactionsUseCase,
            delete_transaction_use_case_1.DeleteTransactionUseCase,
            {
                provide: 'ITransactionRepository',
                useClass: prisma_transaction_repository_1.PrismaTransactionRepository,
            },
            {
                provide: 'IAccountRepository',
                useClass: prisma_account_repository_1.PrismaAccountRepository,
            },
            {
                provide: 'ICoupleRepository',
                useClass: prisma_couple_repository_1.PrismaCoupleRepository,
            },
        ],
        exports: [
            register_transaction_use_case_1.RegisterTransactionUseCase,
            list_transactions_use_case_1.ListTransactionsUseCase,
            delete_transaction_use_case_1.DeleteTransactionUseCase,
        ],
    })
], TransactionModule);
//# sourceMappingURL=transaction.module.js.map