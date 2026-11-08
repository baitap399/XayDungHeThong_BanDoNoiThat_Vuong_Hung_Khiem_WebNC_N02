// file khai báo các api endpoint của chức năng admin và nhận request từ frontend.
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard(@Query('end') end?: string) {
    return this.admin.dashboard(end);
  }

  @Get('revenue')
  revenue() {
    return this.admin.revenue();
  }

  @Get('users')
  users() {
    return this.admin.usersList();
  }
}
