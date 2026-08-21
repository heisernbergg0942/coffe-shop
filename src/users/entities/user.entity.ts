import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BookCategory } from '../../book-categories/entities/book-category.entity';
import { Book } from '../../books/entities/book.entity';
import { Purchase } from '../../purchases/entities/purchase.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'varchar', default: AuthProvider.LOCAL })
  authProvider: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: string;

  @Column({ nullable: true })
  socialId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => BookCategory, (category) => category.createdBy)
  bookCategories: BookCategory[];

  @OneToMany(() => Book, (book) => book.createdBy)
  books: Book[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}
