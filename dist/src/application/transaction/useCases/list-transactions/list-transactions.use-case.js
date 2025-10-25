"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTransactionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../../../../infra/logging/logger.service");
let ListTransactionsUseCase = class ListTransactionsUseCase {
    transactionRepository;
    logger;
    constructor(transactionRepository, logger) {
        this.transactionRepository = transactionRepository;
        this.logger = logger;
    }
    async execute(input) {
        this.logger.logUseCase('ListTransactionsUseCase', {
            coupleId: input.coupleId,
            limit: input.limit,
        });
        const result = await this.transactionRepository.findByFilters({
            coupleId: input.coupleId,
            ...input.filters,
        }, {
            limit: input.limit || 50,
            cursor: input.cursor,
        });
        return {
            transactions: result.data.map((tx) => ({
                id: tx.id,
                account_id: tx.account_id,
                user_id: tx.user_id,
                type: tx.type,
                amount: tx.amount,
                category: tx.category,
                description: tx.description,
                transaction_date: tx.transaction_date,
                is_free_spending: tx.is_free_spending,
                created_at: tx.created_at,
            })),
            next_cursor: result.next_cursor,
        };
    }
};
exports.ListTransactionsUseCase = ListTransactionsUseCase;
exports.ListTransactionsUseCase = ListTransactionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, logger_service_1.LoggerService])
], ListTransactionsUseCase);
//# sourceMappingURL=list-transactions.use-case.js.map