import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSinhvienDto } from './dto/create-sinhvien.dto.js';
import { Sinhvien } from './sinhvien.entity.js';

@Injectable()
export class SinhvienService {
  constructor(
    @InjectRepository(Sinhvien)
    private readonly sinhvienRepository: Repository<Sinhvien>,
  ) {}

  create(dto: CreateSinhvienDto): Promise<Sinhvien> {
    return this.sinhvienRepository.save(dto);
  }

  findAll(): Promise<Sinhvien[]> {
    return this.sinhvienRepository.find({ order: { hoTen: 'ASC' } });
  }
}