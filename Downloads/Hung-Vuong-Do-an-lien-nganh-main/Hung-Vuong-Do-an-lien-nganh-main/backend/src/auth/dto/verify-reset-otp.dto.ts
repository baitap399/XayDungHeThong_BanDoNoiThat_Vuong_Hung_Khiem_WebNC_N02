import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyResetOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP phải gồm đúng 6 chữ số' })
  otp: string;
}
