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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_transaction_use_case_1 = require("../../../application/transaction/useCases/register-transaction/register-transaction.use-case");
const list_transactions_use_case_1 = require("../../../application/transaction/useCases/list-transactions/list-transactions.use-case");
const delete_transaction_use_case_1 = require("../../../application/transaction/useCases/delete-transaction/delete-transaction.use-case");
const register_transaction_dto_1 = require("../dtos/transaction/register-transaction.dto");
const jwt_auth_guard_1 = require("../../../infra/http/auth/guards/jwt-auth.guard");
const couple_guard_1 = require("../../../infra/http/auth/guards/couple.guard");
const current_user_decorator_1 = require("../../../infra/http/auth/decorators/current-user.decorator");
const couple_id_decorator_1 = require("../../../infra/http/auth/decorators/couple-id.decorator");
let TransactionController = class TransactionController {
    registerTransactionUseCase;
    listTransactionsUseCase;
    deleteTransactionUseCase;
    constructor(registerTransactionUseCase, listTransactionsUseCase, deleteTransactionUseCase) {
        this.registerTransactionUseCase = registerTransactionUseCase;
        this.listTransactionsUseCase = listTransactionsUseCase;
        this.deleteTransactionUseCase = deleteTransactionUseCase;
    }
    async registerTransaction(coupleId, user, dto) {
        return this.registerTransactionUseCase.execute({
            coupleId,
            userId: user.id,
            account_id: dto.account_id,
            type: dto.type,
            amount: dto.amount,
            category: dto.category,
            description: dto.description,
            transaction_date: dto.transaction_date,
            is_free_spending: dto.is_free_spending,
        });
    }
    async listTransactions(coupleId, limit, cursor) {
        return this.listTransactionsUseCase.execute({
            coupleId,
            limit: limit ? Number(limit) : undefined,
            cursor,
        });
    }
    async deleteTransaction(coupleId, transactionId) {
        return this.deleteTransactionUseCase.execute({
            coupleId,
            transactionId,
        });
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new transaction' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transaction registered and balances updated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Insufficient free spending or invalid input',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Account not found',
    }),
    __param(0, (0, couple_id_decorator_1.CoupleId)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, register_transaction_dto_1.RegisterTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "registerTransaction", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'List transactions with pagination' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of results per page (default: 50)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        type: String,
        description: 'Cursor for pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transactions retrieved successfully',
    }),
    __param(0, (0, couple_id_decorator_1.CoupleId)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "listTransactions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a transaction and revert balances' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Transaction ID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transaction deleted and balances reverted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Transaction not found',
    }),
    __param(0, (0, couple_id_decorator_1.CoupleId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
exports.TransactionController = TransactionController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, couple_guard_1.CoupleGuard),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [register_transaction_use_case_1.RegisterTransactionUseCase,
        list_transactions_use_case_1.ListTransactionsUseCase,
        delete_transaction_use_case_1.DeleteTransactionUseCase])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map