import { IsUUID, IsEnum, IsNumber, IsString, IsBoolean, IsOptional, IsDate, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionType } from '@core/enum/transaction-type.enum';
import { TransactionCategory } from '@core/enum/transaction-category.enum';

export class RegisterTransactionDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Account ID',
  })
  @IsUUID()
  account_id: string;

  @ApiProperty({
    example: TransactionType.EXPENSE,
    enum: TransactionType,
    description: 'Transaction type',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: 150.50,
    description: 'Transaction amount',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: TransactionCategory.GROCERIES,
    enum: TransactionCategory,
    description: 'Transaction category',
  })
  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @ApiProperty({
    example: 'Weekly groceries at supermarket',
    description: 'Transaction description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Transaction date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  transaction_date?: Date;

  @ApiProperty({
    example: true,
    description: 'Whether this expense should be deducted from free spending',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_free_spending?: boolean;
}
