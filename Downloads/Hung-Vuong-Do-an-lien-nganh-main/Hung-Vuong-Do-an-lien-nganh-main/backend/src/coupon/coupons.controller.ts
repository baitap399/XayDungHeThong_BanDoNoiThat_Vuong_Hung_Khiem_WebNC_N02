import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from '../database/entities/coupon.entity';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Coupon>) {
    return this.couponsService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Coupon>,
  ) {
    return this.couponsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.couponsService.remove(id);

    return {
      message: 'Xóa coupon thành công',
    };
  }

  @Post('validate')
  async validateCoupon(
    @Body()
    body: {
      code: string;
      orderAmount: number;
    },
  ) {
    return this.couponsService.validateCoupon(
      body.code,
      Number(body.orderAmount),
    );
  }
}