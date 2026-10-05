import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monhoc } from '../monhoc/monhoc.entity.js';
import { Sinhvien } from '../sinhvien/sinhvien.entity.js';
import { Dangki } from './dangki.entity.js';
import { DangkiController } from './dangki.controller.js';
import { DangkiService } from './dangki.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Dangki, Sinhvien, Monhoc])],
  controllers: [DangkiController],
  providers: [DangkiService],
})
export class DangkiModule {}