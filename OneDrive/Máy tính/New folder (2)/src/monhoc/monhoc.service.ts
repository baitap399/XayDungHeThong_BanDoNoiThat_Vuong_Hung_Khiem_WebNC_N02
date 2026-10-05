import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMonhocDto } from './dto/create-monhoc.dto.js';
import { Monhoc } from './monhoc.entity.js';

@Injectable()
export class MonhocService {
  constructor(
    @InjectRepository(Monhoc)
    private readonly monhocRepository: Repository<Monhoc>,
  ) {}

  create(dto: CreateMonhocDto): Promise<Monhoc> {
    return this.monhocRepository.save(dto);
  }

  findAll(): Promise<Monhoc[]> {
    return this.monhocRepository.find({ order: { maMonHoc: 'ASC' } });
  }
}