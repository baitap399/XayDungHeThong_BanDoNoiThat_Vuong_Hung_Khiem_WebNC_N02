import { IsInt, Min } from 'class-validator';

export class CreateDangkiDto {
  @IsInt()
  @Min(1)
  sinhVienId: number;

  @IsInt()
  @Min(1)
  monHocId: number;
}