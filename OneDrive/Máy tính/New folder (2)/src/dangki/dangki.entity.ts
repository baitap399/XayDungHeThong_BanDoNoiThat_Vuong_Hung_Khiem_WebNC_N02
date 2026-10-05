import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Monhoc } from '../monhoc/monhoc.entity.js';
import { Sinhvien } from '../sinhvien/sinhvien.entity.js';

@Entity('dangki')
@Index('UQ_dangki_sinhvien_monhoc', ['sinhVien', 'monHoc'], { unique: true })
export class Dangki {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sinhvien, (sinhVien) => sinhVien.dangKis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sinh_vien_id' })
  sinhVien: Relation<Sinhvien>;

  @ManyToOne(() => Monhoc, (monHoc) => monHoc.dangKis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mon_hoc_id' })
  monHoc: Relation<Monhoc>;

  @CreateDateColumn({ type: 'timestamptz' })
  ngayDangKi: Date;
}