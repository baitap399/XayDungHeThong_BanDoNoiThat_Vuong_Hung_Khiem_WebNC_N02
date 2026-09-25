// file tạo guard bảo vệ api bằng jwt và chỉ cho phép request đã đăng nhập.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
