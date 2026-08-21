import { IsString, IsOptional } from 'class-validator';

export class UpdatePurchaseDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePurchaseStatusDto {
  @IsString()
  status: 'pending' | 'completed' | 'cancelled';
}
