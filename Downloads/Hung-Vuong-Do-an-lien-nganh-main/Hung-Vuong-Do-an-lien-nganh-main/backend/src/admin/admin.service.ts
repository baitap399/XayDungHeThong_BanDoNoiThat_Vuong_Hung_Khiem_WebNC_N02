// file chứa logic xử lý nghiệp vụ của chức năng admin và làm việc với database khi cần.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly orders: OrdersService,
  ) {}

  dashboard() {
    return this.orders.dashboardSummary();
  }

  revenue() {
    return this.orders.revenueSummary();
  }

  async usersList() {
    const users = await this.users.find({ order: { createdAt: 'DESC' } });
    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}
