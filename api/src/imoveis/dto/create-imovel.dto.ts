import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsEnum, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoImovel, TipoNegocio, EstadoImovel } from '../entities/imovel.entity';

export class CreateImovelDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }
    return num;
  })
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiProperty({ enum: ['venda', 'aluguel'], required: false })
  @IsOptional()
  @IsEnum(['venda', 'aluguel'])
  tipo?: TipoNegocio;

  @ApiProperty({ enum: ['casa', 'apartamento', 'terreno'], required: false })
  @IsOptional()
  @IsEnum(['casa', 'apartamento', 'terreno'])
  tipoImovel?: TipoImovel;

  @ApiProperty({ enum: ['novo', 'semi-novo'], required: false })
  @IsOptional()
  @IsEnum(['novo', 'semi-novo'])
  estadoImovel?: EstadoImovel;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  aceitaFinanciamento?: boolean;

  @ApiProperty({ type: [String], default: [], required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map(v => String(v)).filter(v => v !== '');
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  fotos?: string[] = [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }
    return num;
  })
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }
    return num;
  })
  @IsNumber()
  @Min(0)
  quartos?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }
    return num;
  })
  @IsNumber()
  @Min(0)
  banheiros?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }
    return num;
  })
  @IsNumber()
  @Min(0)
  vagasGaragem?: number;
} 