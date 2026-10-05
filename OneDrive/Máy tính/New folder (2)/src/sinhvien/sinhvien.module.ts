import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sinhvien } from './sinhvien.entity.js';
import { SinhvienController } from './sinhvien.controller.js';
import { SinhvienService } from './sinhvien.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sinhvien])],
  controllers: [SinhvienController],
  providers: [SinhvienService],
  exports: [TypeOrmModule],
})
export class SinhvienModule {}