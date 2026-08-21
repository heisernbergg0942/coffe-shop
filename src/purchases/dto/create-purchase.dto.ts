import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities/purchase.entity';

export class CreatePurchaseDto {
  @IsUUID()
  bookId: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePurchaseStatusDto {
  @IsString()
  status: 'pending' | 'completed' | 'cancelled';
}
