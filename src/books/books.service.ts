import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookVisibility } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto, createdById: string) {
    const book = this.booksRepository.create({
      title: createBookDto.title,
      author: createBookDto.author,
      description: createBookDto.description,
      visibility: createBookDto.visibility,
      price: createBookDto.price ? Number(createBookDto.price) : undefined,
      coverImage: createBookDto.coverImage,
      content: createBookDto.content,
      categoryId: createBookDto.categoryId,
      createdById,
    });
    return this.booksRepository.save(book);
  }

  async findAll(filters?: { visibility?: BookVisibility; categoryId?: string }) {
    const query: any = { isActive: true };
    if (filters?.visibility) query.visibility = filters.visibility;
    if (filters?.categoryId) query.categoryId = filters.categoryId;
    return this.booksRepository.find({
      where: query,
      relations: ['category', 'createdBy'],
    });
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne({
      where: { id, isActive: true },
      relations: ['category', 'createdBy'],
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto, userId: string) {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    book.isActive = false;
    return this.booksRepository.save(book);
  }
}
