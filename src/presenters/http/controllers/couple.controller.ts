import { Controller, Post, Get, Put, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCoupleUseCase } from '@application/couple/useCases/create-couple/create-couple.use-case';
import { GetCoupleDashboardUseCase } from '@application/couple/useCases/get-couple-dashboard/get-couple-dashboard.use-case';
import { UpdateFreeSpendingUseCase } from '@application/couple/useCases/update-free-spending/update-free-spending.use-case';
import { CreateCoupleDto } from '../dtos/couple/create-couple.dto';
import { UpdateFreeSpendingDto } from '../dtos/couple/update-free-spending.dto';
import { JwtAuthGuard } from '@infra/http/auth/guards/jwt-auth.guard';
import { CoupleGuard } from '@infra/http/auth/guards/couple.guard';
import { CurrentUser } from '@infra/http/auth/decorators/current-user.decorator';
import { CoupleId } from '@infra/http/auth/decorators/couple-id.decorator';
import { AuthenticatedUser } from '@shared/types/authenticated-user.type';

@ApiTags('Couple')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('couple')
export class CoupleController {
  constructor(
    private readonly createCoupleUseCase: CreateCoupleUseCase,
    private readonly getCoupleDashboardUseCase: GetCoupleDashboardUseCase,
    private readonly updateFreeSpendingUseCase: UpdateFreeSpendingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new couple (tenant)' })
  @ApiResponse({
    status: 201,
    description: 'Couple successfully created with FREE plan subscription',
  })
  @ApiResponse({
    status: 400,
    description: 'User already in a couple or invalid input',
  })
  async createCouple(@Body() dto: CreateCoupleDto) {
    return this.createCoupleUseCase.execute(dto);
  }

  @Get('dashboard')
  @UseGuards(CoupleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get couple financial dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Couple not found',
  })
  async getDashboard(
    @CoupleId() coupleId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.getCoupleDashboardUseCase.execute({
      coupleId,
      userId: user.id,
    });
  }

  @Put('free-spending')
  @UseGuards(CoupleGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update free spending allowance' })
  @ApiResponse({
    status: 200,
    description: 'Free spending updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Couple not found',
  })
  async updateFreeSpending(
    @CoupleId() coupleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateFreeSpendingDto,
  ) {
    return this.updateFreeSpendingUseCase.execute({
      coupleId,
      userId: user.id,
      newMonthlyAmount: dto.new_monthly_amount,
    });
  }
}
