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
exports.DeleteTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const transaction_not_found_exception_1 = require("../../../../core/exceptions/transaction/transaction-not-found.exception");
const logger_service_1 = require("../../../../infra/logging/logger.service");
const unit_of_work_1 = require("../../../../infra/database/prisma/unit-of-work");
const transaction_type_enum_1 = require("../../../../core/enum/transaction-type.enum");
let DeleteTransactionUseCase = class DeleteTransactionUseCase {
    transactionRepository;
    accountRepository;
    unitOfWork;
    eventEmitter;
    logger;
    constructor(transactionRepository, accountRepository, unitOfWork, eventEmitter, logger) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.unitOfWork = unitOfWork;
        this.eventEmitter = eventEmitter;
        this.logger = logger;
    }
    async execute(input) {
        this.logger.logUseCase('DeleteTransactionUseCase', {
            coupleId: input.coupleId,
            transactionId: input.transactionId,
        });
        const transaction = await this.transactionRepository.findById(input.transactionId);
        if (!transaction) {
            throw new transaction_not_found_exception_1.TransactionNotFoundException(input.transactionId);
        }
        await this.unitOfWork.execute(async (prisma) => {
            const balanceChange = transaction.type === transaction_type_enum_1.TransactionType.INCOME
                ? -transaction.amount
                : transaction.amount;
            await prisma.account.update({
                where: { id: transaction.account_id },
                data: {
                    balance: {
                        increment: balanceChange,
                    },
                },
            });
            if (transaction.type === transaction_type_enum_1.TransactionType.EXPENSE && transaction.is_free_spending) {
                const couple = await prisma.couple.findUnique({
                    where: { id: input.coupleId },
                });
                if (couple) {
                    const isUserA = couple.user_id_a === transaction.user_id;
                    await prisma.couple.update({
                        where: { id: input.coupleId },
                        data: isUserA
                            ? { free_spending_a_remaining: { increment: transaction.amount } }
                            : { free_spending_b_remaining: { increment: transaction.amount } },
                    });
                }
            }
            await prisma.transaction.delete({
                where: { id: input.transactionId },
            });
        });
        this.eventEmitter.emit('transaction.deleted', {
            transactionId: input.transactionId,
            coupleId: input.coupleId,
            userId: transaction.user_id,
            type: transaction.type,
            amount: transaction.amount,
        });
        this.logger.log('Transaction deleted successfully', {
            transactionId: input.transactionId,
            coupleId: input.coupleId,
        });
        return {
            success: true,
            deleted_transaction_id: input.transactionId,
        };
    }
};
exports.DeleteTransactionUseCase = DeleteTransactionUseCase;
exports.DeleteTransactionUseCase = DeleteTransactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, unit_of_work_1.UnitOfWork,
        event_emitter_1.EventEmitter2,
        logger_service_1.LoggerService])
], DeleteTransactionUseCase);
//# sourceMappingURL=delete-transaction.use-case.js.map