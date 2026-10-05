import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Dangki } from '../dangki/dangki.entity.js';

@Entity('monhoc')
export class Monhoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  maMonHoc: string;

  @Column({ length: 100 })
  tenMonHoc: string;

  @Column({ type: 'int', default: 3 })
  soTinChi: number;

  @OneToMany(() => Dangki, (dangki) => dangki.monHoc)
  dangKis: Relation<Dangki[]>;
}