import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSinhvienDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  maSinhVien: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  hoTen: string;

  @IsEmail()
  @MaxLength(150)
  email: string;
}