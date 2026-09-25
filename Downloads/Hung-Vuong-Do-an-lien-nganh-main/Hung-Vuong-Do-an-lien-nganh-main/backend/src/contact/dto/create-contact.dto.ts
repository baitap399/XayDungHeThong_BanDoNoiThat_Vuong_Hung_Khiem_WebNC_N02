// file định nghĩa và kiểm tra dữ liệu đầu vào cho chức năng create-contact.
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
