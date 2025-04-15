import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email ou username do usuário',
    example: 'usuario@exemplo.com',
    required: false
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiProperty({
    description: 'Username do usuário',
    example: 'usuario123',
    required: false
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 