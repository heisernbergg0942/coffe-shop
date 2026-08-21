import { Controller, Get, UseGuards, Request, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { BookVisibility } from './entities/book.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new book (Admin only)' })
  create(@Body() createBookDto: CreateBookDto, @Request() req: any) {
    return this.booksService.create(createBookDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books (public by default)' })
  findAll(@Query('visibility') visibility?: BookVisibility, @Query('categoryId') categoryId?: string) {
    return this.booksService.findAll({ visibility, categoryId });
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public books' })
  findPublic(@Query('categoryId') categoryId?: string) {
    return this.booksService.findAll({ visibility: BookVisibility.PUBLIC, categoryId });
  }

  @Get('sell')
  @ApiOperation({ summary: 'Get all books for sale' })
  findForSale(@Query('categoryId') categoryId?: string) {
    return this.booksService.findAll({ visibility: BookVisibility.SELL, categoryId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a book (Admin only)' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Request() req: any) {
    return this.booksService.update(id, updateBookDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a book (Admin only)' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
