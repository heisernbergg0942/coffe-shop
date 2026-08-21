import { IsString, IsOptional } from 'class-validator';

export class UpdatePurchaseDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
