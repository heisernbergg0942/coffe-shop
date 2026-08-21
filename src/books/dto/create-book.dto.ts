import { IsString, IsOptional, IsEnum, IsNumber, MaxLength } from 'class-validator';
import { BookVisibility } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  title: string;

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

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  categoryId: string;
}

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

  @IsNumber()
  @IsOptional()
  price?: number;

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
