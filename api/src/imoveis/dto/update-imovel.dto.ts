import { PartialType } from '@nestjs/mapped-types';
import { CreateImovelDto } from './create-imovel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateImovelDto extends PartialType(CreateImovelDto) {
  @ApiProperty({ required: false, description: 'Lista de fotos do imóvel' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map(v => String(v)).filter(v => v !== '');
    }
    return [];
  })
  fotos?: string[];
} 