import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { BookCategoriesModule } from '../book-categories/book-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), BookCategoriesModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
