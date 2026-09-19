import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

const imageStorage = diskStorage({
  destination: './uploads/products',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname).toLowerCase()}`),
});

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query('keyword') keyword?: string, @Query('category') category?: string) {
    return this.products.list({ keyword, category });
  }

  @Get('featured')
  featured() {
    return this.products.featured();
  }

  @Get('categories/list')
  categories() {
    return this.products.categories();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.products.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', { storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } }))
  create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.products.create(dto, file ? `/uploads/products/${file.filename}` : undefined);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', { storage: imageStorage, limits: { fileSize: 10 * 1024 * 1024 } }))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.products.update(id, dto, file ? `/uploads/products/${file.filename}` : undefined);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.products.remove(id);
  }
}
