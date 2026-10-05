import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Monhoc } from '../monhoc/monhoc.entity.js';
import { Sinhvien } from '../sinhvien/sinhvien.entity.js';
import { CreateDangkiDto } from './dto/create-dangki.dto.js';
import { Dangki } from './dangki.entity.js';

@Injectable()
export class DangkiService {
  constructor(
    @InjectRepository(Dangki)
    private readonly dangkiRepository: Repository<Dangki>,
    @InjectRepository(Sinhvien)
    private readonly sinhvienRepository: Repository<Sinhvien>,
    @InjectRepository(Monhoc)
    private readonly monhocRepository: Repository<Monhoc>,
  ) {}

  async create(dto: CreateDangkiDto): Promise<Dangki> {
    const sinhVien = await this.sinhvienRepository.findOneBy({
      id: dto.sinhVienId,
    });
    if (!sinhVien) {
      throw new NotFoundException('Không tìm thấy sinh viên.');
    }

    const monHoc = await this.monhocRepository.findOneBy({ id: dto.monHocId });
    if (!monHoc) {
      throw new NotFoundException('Không tìm thấy môn học.');
    }

    const existing = await this.dangkiRepository.findOne({
      where: { sinhVien: { id: sinhVien.id }, monHoc: { id: monHoc.id } },
    });
    if (existing) {
      throw new ConflictException('Sinh viên đã đăng ký môn học này.');
    }

    try {
      return await this.dangkiRepository.save({ sinhVien, monHoc });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Sinh viên đã đăng ký môn học này.');
      }
      throw error;
    }
  }

  findAll(): Promise<Dangki[]> {
    return this.dangkiRepository.find({
      relations: { sinhVien: true, monHoc: true },
      order: { ngayDangKi: 'DESC' },
    });
  }

  findRegisteredStudents(): Promise<Sinhvien[]> {
    return this.sinhvienRepository
      .createQueryBuilder('sinhvien')
      .innerJoinAndSelect('sinhvien.dangKis', 'dangki')
      .innerJoinAndSelect('dangki.monHoc', 'monHoc')
      .orderBy('sinhvien.hoTen', 'ASC')
      .addOrderBy('dangki.ngayDangKi', 'DESC')
      .getMany();
  }
}