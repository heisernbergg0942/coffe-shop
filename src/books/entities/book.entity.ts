import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BookCategory } from '../../book-categories/entities/book-category.entity';

export enum BookVisibility {
  PUBLIC = 'public',
  SELL = 'sell',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'varchar', default: BookVisibility.PUBLIC })
  visibility: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  content: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  categoryId: string;

  @ManyToOne(() => BookCategory, (category) => category.books, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: BookCategory;

  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}
