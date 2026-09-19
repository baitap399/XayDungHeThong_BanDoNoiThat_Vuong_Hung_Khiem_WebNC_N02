import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CartService } from './cart.service';

class CartChangeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  get(@CurrentUser() user: AuthUser) {
    return this.cart.get(user.id);
  }

  @Post('add')
  add(@CurrentUser() user: AuthUser, @Body() dto: CartChangeDto) {
    return this.cart.add(user.id, dto.productId, dto.quantity);
  }

  @Put('update')
  update(@CurrentUser() user: AuthUser, @Body() dto: CartChangeDto) {
    return this.cart.update(user.id, dto.productId, dto.quantity);
  }

  @Delete('remove/:productId')
  remove(@CurrentUser() user: AuthUser, @Param('productId', ParseIntPipe) productId: number) {
    return this.cart.remove(user.id, productId);
  }

  @Delete('clear')
  clear(@CurrentUser() user: AuthUser) {
    return this.cart.clear(user.id);
  }
}
