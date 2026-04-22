import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  debtorPhone: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  totalInstallments?: number;
}

export class UpdateDebtDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  currentInstallment?: number;
}
