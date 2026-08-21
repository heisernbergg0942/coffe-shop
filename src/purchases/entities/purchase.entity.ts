import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', default: PaymentMethod.CASH })
  paymentMethod: string;

  @Column({ type: 'varchar', default: PurchaseStatus.PENDING })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.purchases, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  bookId: string;

  @ManyToOne(() => Book, (book) => book.id, { eager: true })
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
