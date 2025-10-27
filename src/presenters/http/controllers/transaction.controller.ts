import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RegisterTransactionUseCase } from '@application/transaction/useCases/register-transaction/register-transaction.use-case';
import { ListTransactionsUseCase } from '@application/transaction/useCases/list-transactions/list-transactions.use-case';
import { DeleteTransactionUseCase } from '@application/transaction/useCases/delete-transaction/delete-transaction.use-case';
import { RegisterTransactionDto } from '../dtos/transaction/register-transaction.dto';
import { JwtAuthGuard } from '@infra/http/auth/guards/jwt-auth.guard';
import { CoupleGuard } from '@infra/http/auth/guards/couple.guard';
import { CurrentUser } from '@infra/http/auth/decorators/current-user.decorator';
import { CoupleId } from '@infra/http/auth/decorators/couple-id.decorator';
import { AuthenticatedUser } from '@shared/types/authenticated-user.type';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CoupleGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction registered and balances updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient free spending or invalid input',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async registerTransaction(
    @CoupleId() coupleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterTransactionDto,
  ) {
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List transactions with pagination and filters' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page (default: 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['INCOME', 'EXPENSE'],
    description: 'Filter by transaction type',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'account_id',
    required: false,
    type: String,
    description: 'Filter by account ID',
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    type: String,
    description: 'Filter by start date (ISO format)',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    type: String,
    description: 'Filter by end date (ISO format)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in description',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  async listTransactions(
    @CoupleId() coupleId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('account_id') accountId?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('search') search?: string,
  ) {
    return this.listTransactionsUseCase.execute({
      coupleId,
      limit: limit ? Number(limit) : undefined,
      cursor,
      type,
      category,
      accountId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      search,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transaction and revert balances' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted and balances reverted',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async deleteTransaction(
    @CoupleId() coupleId: string,
    @Param('id') transactionId: string,
  ) {
    return this.deleteTransactionUseCase.execute({
      coupleId,
      transactionId,
    });
  }
}
