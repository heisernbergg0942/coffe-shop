import { Injectable, OnModuleInit } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import { BookCategory } from '../book-categories/entities/book-category.entity';
import { Book, BookVisibility } from '../books/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(BookCategory)
    private readonly categoriesRepository: Repository<BookCategory>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedCategoriesAndBooks();
  }

  async seedUsers() {
    const adminEmail = 'admin@coffee.shop';
    const admin = await this.usersRepository.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const user = this.usersRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: UserRole.ADMIN,
        authProvider: 'local',
        isActive: true,
      });
      await this.usersRepository.save(user);
      console.log('Seeded admin user: admin@coffee.shop / admin123');
    }

    const userEmail = 'user@coffee.shop';
    const regularUser = await this.usersRepository.findOne({ where: { email: userEmail } });
    if (!regularUser) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      const user = this.usersRepository.create({
        email: userEmail,
        password: hashedPassword,
        name: 'Regular User',
        role: UserRole.USER,
        authProvider: 'local',
        isActive: true,
      });
      await this.usersRepository.save(user);
      console.log('Seeded regular user: user@coffee.shop / user123');
    }
  }

  async seedCategoriesAndBooks() {
    const admin = await this.usersRepository.findOne({ where: { email: 'admin@coffee.shop' } });
    if (!admin) return;

    const categoryNames = ['Fiction', 'Science', 'History', 'Technology', 'Poetry'];
    const createdCategories: BookCategory[] = [];

    for (const name of categoryNames) {
      const existing = await this.categoriesRepository.findOne({ where: { name } });
      if (!existing) {
        const category = this.categoriesRepository.create({
          name,
          description: `${name} books for coffee shop readers`,
          createdById: admin.id,
          isActive: true,
        });
        const saved = await this.categoriesRepository.save(category);
        createdCategories.push(saved);
      } else {
        createdCategories.push(existing);
      }
    }

    const sampleBooks = [
      { title: 'The Coffee House', author: 'Jane Doe', description: 'A cozy story set in a coffee shop.', visibility: BookVisibility.PUBLIC, price: undefined, categoryName: 'Fiction' },
      { title: 'Latte Art Basics', author: 'Barista John', description: 'Learn latte art from scratch.', visibility: BookVisibility.SELL, price: 9.99, categoryName: 'Technology' },
      { title: 'History of Coffee', author: 'Dr. Bean', description: 'From Ethiopia to your cup.', visibility: BookVisibility.PUBLIC, price: undefined, categoryName: 'History' },
      { title: 'Quantum Brewing', author: 'Physicist Paul', description: 'Science meets coffee.', visibility: BookVisibility.SELL, price: 14.50, categoryName: 'Science' },
      { title: 'Poems for Mornings', author: 'Emily S.', description: 'Short poems for early mornings.', visibility: BookVisibility.PUBLIC, price: undefined, categoryName: 'Poetry' },
      { title: 'Modern Web Dev', author: 'Dev Alex', description: 'NestJS, Next.js and more.', visibility: BookVisibility.SELL, price: 19.99, categoryName: 'Technology' },
    ];

    for (const bookData of sampleBooks) {
      const category = createdCategories.find(c => c.name === bookData.categoryName);
      if (!category) continue;

      const existing = await this.booksRepository.findOne({ where: { title: bookData.title, categoryId: category.id } });
      if (!existing) {
        const book = this.booksRepository.create({
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          visibility: bookData.visibility,
          price: bookData.price,
          categoryId: category.id,
          createdById: admin.id,
          isActive: true,
        });
        await this.booksRepository.save(book);
      }
    }

    console.log('Seeded categories and books');
  }
}
