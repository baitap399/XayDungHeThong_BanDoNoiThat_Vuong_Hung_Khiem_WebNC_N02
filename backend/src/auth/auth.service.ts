import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Cart } from '../database/entities/cart.entity';
import { UserRole } from '../database/entities/enums';
import { User } from '../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const emailExists = await this.users.exists({ where: { email: dto.email } });
    const usernameExists = await this.users.exists({ where: { username: dto.username } });
    if (emailExists) throw new ConflictException('Email đã được sử dụng');
    if (usernameExists) throw new ConflictException('Tên đăng nhập đã được sử dụng');

    const user = this.users.create({
      fullName: dto.fullName,
      username: dto.username,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      phone: dto.phone ?? null,
      role: UserRole.USER,
    });
    const saved = await this.users.save(user);
    await this.carts.save(this.carts.create({ userId: saved.id }));
    return this.loginUser(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: [{ email: dto.usernameOrEmail }, { username: dto.usernameOrEmail }],
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    return this.loginUser(user);
  }

  async getProfile(userId: number) {
    const user = await this.users.findOneByOrFail({ id: userId });
    return this.publicUser(user);
  }

  private loginUser(user: User) {
    const payload = { sub: user.id, username: user.username, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
      user: this.publicUser(user),
    };
  }

  publicUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }
}
