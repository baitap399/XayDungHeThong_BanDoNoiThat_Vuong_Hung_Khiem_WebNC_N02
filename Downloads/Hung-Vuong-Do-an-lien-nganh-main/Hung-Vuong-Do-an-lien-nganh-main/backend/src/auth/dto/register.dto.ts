// file định nghĩa và kiểm tra dữ liệu đầu vào cho chức năng register.
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  fullName: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
