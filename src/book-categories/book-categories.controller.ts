import { Controller, Get, UseGuards, Request, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('book-categories')
@Controller('book-categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookCategoriesController {
  constructor(private readonly bookCategoriesService: BookCategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new book category (Admin only)' })
  create(@Body() createBookCategoryDto: CreateBookCategoryDto, @Request() req: any) {
    return this.bookCategoriesService.create(createBookCategoryDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all book categories' })
  findAll() {
    return this.bookCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book category by ID' })
  findOne(@Param('id') id: string) {
    return this.bookCategoriesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a book category (Admin only)' })
  update(@Param('id') id: string, @Body() updateBookCategoryDto: UpdateBookCategoryDto, @Request() req: any) {
    return this.bookCategoriesService.update(id, updateBookCategoryDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a book category (Admin only)' })
  remove(@Param('id') id: string) {
    return this.bookCategoriesService.remove(id);
  }
}
