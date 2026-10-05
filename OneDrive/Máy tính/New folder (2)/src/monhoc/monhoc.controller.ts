import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMonhocDto } from './dto/create-monhoc.dto.js';
import { MonhocService } from './monhoc.service.js';

@Controller('monhoc')
export class MonhocController {
  constructor(private readonly monhocService: MonhocService) {}

  @Post()
  create(@Body() dto: CreateMonhocDto) {
    return this.monhocService.create(dto);
  }

  @Get()
  findAll() {
    return this.monhocService.findAll();
  }
}