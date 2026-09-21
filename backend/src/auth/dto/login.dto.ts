// file định nghĩa và kiểm tra dữ liệu đầu vào cho chức năng login.
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  usernameOrEmail: string;

  @IsString()
  @MinLength(1)
  password: string;
}
