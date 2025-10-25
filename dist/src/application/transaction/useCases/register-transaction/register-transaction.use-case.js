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
exports.RegisterTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const transaction_entity_1 = require("../../../../core/domain/entities/transaction.entity");
const account_not_found_exception_1 = require("../../../../core/exceptions/account/account-not-found.exception");
const couple_not_found_exception_1 = require("../../../../core/exceptions/couple/couple-not-found.exception");
const insufficient_free_spending_exception_1 = require("../../../../core/exceptions/transaction/insufficient-free-spending.exception");
const logger_service_1 = require("../../../../infra/logging/logger.service");
const unit_of_work_1 = require("../../../../infra/database/prisma/unit-of-work");
const transaction_type_enum_1 = require("../../../../core/enum/transaction-type.enum");
let RegisterTransactionUseCase = class RegisterTransactionUseCase {
    transactionRepository;
    accountRepository;
    coupleRepository;
    unitOfWork;
    eventEmitter;
    logger;
    constructor(transactionRepository, accountRepository, coupleRepository, unitOfWork, eventEmitter, logger) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.coupleRepository = coupleRepository;
        this.unitOfWork = unitOfWork;
        this.eventEmitter = eventEmitter;
        this.logger = logger;
    }
    async execute(input) {
        this.logger.logUseCase('RegisterTransactionUseCase', {
            coupleId: input.coupleId,
            userId: input.userId,
            type: input.type,
            amount: input.amount,
        });
        const account = await this.accountRepository.findById(input.account_id);
        if (!account) {
            throw new account_not_found_exception_1.AccountNotFoundException(input.account_id);
        }
        const couple = await this.coupleRepository.findById(input.coupleId);
        if (!couple) {
            throw new couple_not_found_exception_1.CoupleNotFoundException(input.coupleId);
        }
        if (input.type === transaction_type_enum_1.TransactionType.EXPENSE && input.is_free_spending) {
            const isUserA = couple.isUserA(input.userId);
            const freeSpendingRemaining = isUserA
                ? couple.free_spending_a_remaining
                : couple.free_spending_b_remaining;
            if (freeSpendingRemaining < input.amount) {
                throw new insufficient_free_spending_exception_1.InsufficientFreeSpendingException(freeSpendingRemaining);
            }
        }
        const result = await this.unitOfWork.execute(async (prisma) => {
            const transaction = new transaction_entity_1.Transaction({
                couple_id: input.coupleId,
                account_id: input.account_id,
                user_id: input.userId,
                type: input.type,
                amount: input.amount,
                category: input.category,
                description: input.description || null,
                transaction_date: input.transaction_date || new Date(),
                is_free_spending: input.is_free_spending || false,
            });
            const createdTransaction = await prisma.transaction.create({
                data: {
                    id: transaction.id,
                    couple_id: transaction.couple_id,
                    account_id: transaction.account_id,
                    user_id: transaction.user_id,
                    type: transaction.type,
                    amount: transaction.amount,
                    category: transaction.category,
                    description: transaction.description,
                    transaction_date: transaction.transaction_date,
                    is_free_spending: transaction.is_free_spending,
                },
            });
            const balanceChange = input.type === transaction_type_enum_1.TransactionType.INCOME ? input.amount : -input.amount;
            await prisma.account.update({
                where: { id: input.account_id },
                data: {
                    balance: {
                        increment: balanceChange,
                    },
                },
            });
            if (input.type === transaction_type_enum_1.TransactionType.EXPENSE && input.is_free_spending) {
                const isUserA = couple.isUserA(input.userId);
                await prisma.couple.update({
                    where: { id: input.coupleId },
                    data: isUserA
                        ? { free_spending_a_remaining: { decrement: input.amount } }
                        : { free_spending_b_remaining: { decrement: input.amount } },
                });
            }
            return createdTransaction;
        });
        this.eventEmitter.emit('transaction.registered', {
            transactionId: result.id,
            coupleId: input.coupleId,
            userId: input.userId,
            type: input.type,
            amount: input.amount,
            is_free_spending: input.is_free_spending,
        });
        this.logger.log('Transaction registered successfully', {
            transactionId: result.id,
            coupleId: input.coupleId,
            type: input.type,
            amount: input.amount,
        });
        return {
            id: result.id,
            couple_id: result.couple_id,
            account_id: result.account_id,
            type: result.type,
            amount: Number(result.amount),
            category: result.category,
            description: result.description,
            transaction_date: result.transaction_date,
            is_free_spending: result.is_free_spending,
            created_at: result.created_at,
        };
    }
};
exports.RegisterTransactionUseCase = RegisterTransactionUseCase;
exports.RegisterTransactionUseCase = RegisterTransactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, unit_of_work_1.UnitOfWork,
        event_emitter_1.EventEmitter2,
        logger_service_1.LoggerService])
], RegisterTransactionUseCase);
//# sourceMappingURL=register-transaction.use-case.js.map