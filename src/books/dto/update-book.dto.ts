import { IsString, IsOptional, IsEnum, IsDecimal, MaxLength } from 'class-validator';
import { BookVisibility } from '../entities/book.entity';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(BookVisibility)
  @IsOptional()
  visibility?: BookVisibility;

  @IsDecimal()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
