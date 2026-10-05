import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDangkiDto } from './dto/create-dangki.dto.js';
import { DangkiService } from './dangki.service.js';

@Controller('dangki')
export class DangkiController {
  constructor(private readonly dangkiService: DangkiService) {}

  @Post()
  create(@Body() dto: CreateDangkiDto) {
    return this.dangkiService.create(dto);
  }

  @Get()
  findAll() {
    return this.dangkiService.findAll();
  }

  @Get('sinhvien')
  findRegisteredStudents() {
    return this.dangkiService.findRegisteredStudents();
  }
}