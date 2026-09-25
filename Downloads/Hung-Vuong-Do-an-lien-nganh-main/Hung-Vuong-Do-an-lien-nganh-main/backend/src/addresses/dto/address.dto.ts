import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  address: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
