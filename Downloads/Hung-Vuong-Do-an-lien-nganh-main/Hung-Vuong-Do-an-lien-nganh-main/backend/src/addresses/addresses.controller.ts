import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.addresses.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateAddressDto) {
    return this.addresses.create(user.id, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto) {
    return this.addresses.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.addresses.remove(user.id, id);
  }
}
