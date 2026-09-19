import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../database/entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactMessage) private readonly messages: Repository<ContactMessage>) {}

  async create(dto: CreateContactDto) {
    const message = this.messages.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      message: dto.message,
      isRead: false,
    });
    return this.messages.save(message);
  }

  async adminList() {
    return this.messages.find({ order: { createdAt: 'DESC' } });
  }

  async markRead(id: number) {
    const message = await this.messages.findOneBy({ id });
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn');
    message.isRead = true;
    return this.messages.save(message);
  }

  async remove(id: number) {
    const message = await this.messages.findOneBy({ id });
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn');
    await this.messages.remove(message);
    return { message: 'Đã xóa tin nhắn' };
  }
}
