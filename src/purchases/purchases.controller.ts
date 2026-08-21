import { Controller, Get, UseGuards, Request, Post, Body, Put, Param } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('purchases')
@Controller('purchases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: 'Purchase a book (default: cash)' })
  create(@Body() createPurchaseDto: CreatePurchaseDto, @Request() req: any) {
    return this.purchasesService.create(createPurchaseDto, req.user.id);
  }

  @Get('my-purchases')
  @ApiOperation({ summary: 'Get my purchase history' })
  getMyPurchases(@Request() req: any) {
    return this.purchasesService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all purchases (Admin only)' })
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update purchase status (Admin only)' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdatePurchaseStatusDto) {
    return this.purchasesService.updateStatus(id, updateDto);
  }
}
