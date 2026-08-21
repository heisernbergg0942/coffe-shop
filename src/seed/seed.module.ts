import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { BookCategory } from '../book-categories/entities/book-category.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BookCategory, Book])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
