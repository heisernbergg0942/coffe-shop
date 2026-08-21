import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AuthProvider, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: [{ email: createUserDto.email }],
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const user = this.usersRepository.create({
      ...createUserDto,
      authProvider: AuthProvider.LOCAL,
      role: createUserDto.role || UserRole.USER,
      password: createUserDto.password ? await bcrypt.hash(createUserDto.password, 10) : undefined,
    });
    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email, isActive: true } });
  }

  async findBySocialId(provider: AuthProvider, socialId: string) {
    return this.usersRepository.findOne({
      where: { authProvider: provider, socialId, isActive: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async validatePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
