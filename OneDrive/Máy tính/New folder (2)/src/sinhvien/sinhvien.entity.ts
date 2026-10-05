import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Dangki } from '../dangki/dangki.entity.js';

@Entity('sinhvien')
export class Sinhvien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  maSinhVien: string;

  @Column({ length: 100 })
  hoTen: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @OneToMany(() => Dangki, (dangki) => dangki.sinhVien)
  dangKis: Relation<Dangki[]>;
}