import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monhoc } from './monhoc.entity.js';
import { MonhocController } from './monhoc.controller.js';
import { MonhocService } from './monhoc.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Monhoc])],
  controllers: [MonhocController],
  providers: [MonhocService],
  exports: [TypeOrmModule],
})
export class MonhocModule {}