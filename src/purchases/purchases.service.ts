import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase, PaymentMethod, PurchaseStatus } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/create-purchase.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    private booksService: BooksService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: string) {
    const book = await this.booksService.findOne(createPurchaseDto.bookId);
    const purchase = this.purchasesRepository.create({
      bookId: createPurchaseDto.bookId,
      userId,
      totalAmount: book.price,
      paymentMethod: createPurchaseDto.paymentMethod || PaymentMethod.CASH,
      status: PurchaseStatus.PENDING,
      notes: createPurchaseDto.notes,
    } as any);
    return this.purchasesRepository.save(purchase);
  }

  async findAll() {
    return this.purchasesRepository.find({
      relations: ['user', 'book', 'book.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
      relations: ['user', 'book', 'book.category'],
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  async findByUser(userId: string) {
    return this.purchasesRepository.find({
      where: { userId },
      relations: ['book', 'book.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateDto: UpdatePurchaseStatusDto) {
    const purchase = await this.findOne(id);
    purchase.status = updateDto.status as any;
    return this.purchasesRepository.save(purchase);
  }
}
