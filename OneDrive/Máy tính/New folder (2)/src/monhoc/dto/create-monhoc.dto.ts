import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateMonhocDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  maMonHoc: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tenMonHoc: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  soTinChi?: number;
}