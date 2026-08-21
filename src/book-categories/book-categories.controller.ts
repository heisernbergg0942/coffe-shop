import { Controller, Get, UseGuards, Request, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { BookCategoriesService } from './book-categories.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('book-categories')
@Controller('book-categories')
@ApiBearerAuth()
export class BookCategoriesController {
  constructor(private readonly bookCategoriesService: BookCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new book category' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a book category' })
  update(@Param('id') id: string, @Body() updateBookCategoryDto: UpdateBookCategoryDto, @Request() req: any) {
    return this.bookCategoriesService.update(id, updateBookCategoryDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a book category' })
  remove(@Param('id') id: string) {
    return this.bookCategoriesService.remove(id);
  }
}
