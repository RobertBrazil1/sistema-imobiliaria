import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'jwt_token',
        user: {
          id: 'uuid',
          username: 'usuario',
          nome: 'Nome do Usuário',
          email: 'usuario@exemplo.com',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Identificador (username ou email) e senha são obrigatórios',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      // Verifica se pelo menos um dos campos de identificação foi fornecido
      if (!loginDto.password || (!loginDto.identifier && !loginDto.username)) {
        throw new BadRequestException('Identificador (username ou email) e senha são obrigatórios');
      }

      // Usa o username se fornecido, caso contrário usa o identifier
      const identifier = loginDto.username || loginDto.identifier;
      console.log(`[AuthController] Tentativa de login com identificador: ${identifier}`);

      const user = await this.authService.validateUser(identifier, loginDto.password);
      
      if (!user) {
        console.log(`[AuthController] Login falhou para o identificador: ${identifier}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      console.log(`[AuthController] Login bem-sucedido para o usuário: ${user.username}`);
      return this.authService.login(user);
    } catch (error) {
      console.error(`[AuthController] Erro no login:`, {
        identifier: loginDto.username || loginDto.identifier,
        error: error.message
      });
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log(`[AuthController] Tentativa de registro para:`, {
        username: createUserDto.username,
        email: createUserDto.email
      });
      return await this.authService.register(createUserDto);
    } catch (error) {
      console.error(`[AuthController] Erro no registro:`, {
        username: createUserDto.username,
        email: createUserDto.email,
        error: error.message
      });
      if (error.code === '23505') {
        throw new BadRequestException('Email ou username já cadastrado');
      }
      throw error;
    }
  }
} 