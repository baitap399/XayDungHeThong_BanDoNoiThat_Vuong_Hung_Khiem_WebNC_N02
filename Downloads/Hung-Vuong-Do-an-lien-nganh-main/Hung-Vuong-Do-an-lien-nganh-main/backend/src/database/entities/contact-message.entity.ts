// file định nghĩa entity contact-message và ánh xạ dữ liệu của entity này với bảng trong database.
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
