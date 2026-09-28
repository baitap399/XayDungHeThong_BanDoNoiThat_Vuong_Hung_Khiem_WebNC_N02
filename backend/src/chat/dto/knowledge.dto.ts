import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { KnowledgeStatus } from '../../database/entities/chatbot-knowledge.entity';

export class CreateKnowledgeDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  question: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  answer: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MaxLength(1000)
  keywords?: string;
}

export class UpdateKnowledgeDto extends PartialType(CreateKnowledgeDto, { skipNullProperties: false }) {}

export class ListKnowledgeDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(KnowledgeStatus)
  status?: KnowledgeStatus;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
