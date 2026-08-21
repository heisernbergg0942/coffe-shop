import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoriesService {
  constructor(
    @InjectRepository(BookCategory)
    private bookCategoriesRepository: Repository<BookCategory>,
  ) {}

  async create(createBookCategoryDto: any, createdById: string) {
    const existing = await this.bookCategoriesRepository.findOne({
      where: { name: createBookCategoryDto.name },
    });
    if (existing) {
      throw new ConflictException('Category name already exists');
    }
    const category = this.bookCategoriesRepository.create({
      ...createBookCategoryDto,
      createdById,
    });
    return this.bookCategoriesRepository.save(category);
  }

  async findAll() {
    return this.bookCategoriesRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const category = await this.bookCategoriesRepository.findOne({
      where: { id, isActive: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateBookCategoryDto: any, userId: string) {
    const category = await this.findOne(id);
    Object.assign(category, updateBookCategoryDto);
    return this.bookCategoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    category.isActive = false;
    return this.bookCategoriesRepository.save(category);
  }
}
