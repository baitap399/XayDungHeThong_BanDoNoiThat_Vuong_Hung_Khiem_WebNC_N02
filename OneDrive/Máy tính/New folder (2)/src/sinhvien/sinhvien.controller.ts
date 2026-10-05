import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSinhvienDto } from './dto/create-sinhvien.dto.js';
import { SinhvienService } from './sinhvien.service.js';

@Controller('sinhvien')
export class SinhvienController {
  constructor(private readonly sinhvienService: SinhvienService) {}

  @Post()
  create(@Body() dto: CreateSinhvienDto) {
    return this.sinhvienService.create(dto);
  }

  @Get()
  findAll() {
    return this.sinhvienService.findAll();
  }
}