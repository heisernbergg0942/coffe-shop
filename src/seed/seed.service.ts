import { Injectable, OnModuleInit } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
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
}
