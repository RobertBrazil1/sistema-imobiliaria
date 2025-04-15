import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    try {
      console.log(`[AuthService] Tentando validar usuário com identificador: ${identifier}`);
      
      // Primeiro tenta encontrar por username
      let user = await this.usersService.findByUsername(identifier);
      console.log(`[AuthService] Resultado da busca por username:`, user ? 'encontrado' : 'não encontrado');
      
      // Se não encontrou por username, tenta por email
      if (!user) {
        console.log(`[AuthService] Tentando buscar por email: ${identifier}`);
        user = await this.usersService.findByEmail(identifier);
        console.log(`[AuthService] Resultado da busca por email:`, user ? 'encontrado' : 'não encontrado');
      }
      
      if (!user) {
        console.log(`[AuthService] Usuário não encontrado para o identificador: ${identifier}`);
        return null;
      }

      console.log(`[AuthService] Comparando senha para o usuário: ${user.username}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[AuthService] Resultado da comparação de senha:`, isPasswordValid ? 'válida' : 'inválida');
      
      if (!isPasswordValid) {
        console.log(`[AuthService] Senha inválida para o usuário: ${user.username}`);
        return null;
      }

      console.log(`[AuthService] Usuário validado com sucesso:`, {
        id: user.id,
        username: user.username,
        email: user.email
      });
      
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error(`[AuthService] Erro ao validar usuário:`, {
        identifier,
        error: error.message,
        stack: error.stack
      });
      return null;
    }
  }

  async login(user: any) {
    try {
      console.log(`[AuthService] Iniciando processo de login para o usuário:`, {
        id: user.id,
        username: user.username,
        email: user.email
      });
      
      const payload = { 
        username: user.username, 
        sub: user.id,
        role: user.role 
      };
      
      console.log(`[AuthService] Gerando token JWT com payload:`, payload);
      const token = this.jwtService.sign(payload);
      console.log(`[AuthService] Token JWT gerado com sucesso`);
      
      const response = {
        access_token: token,
        user: {
          id: user.id,
          username: user.username,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      };
      
      console.log(`[AuthService] Login concluído com sucesso para o usuário: ${user.username}`);
      return response;
    } catch (error) {
      console.error(`[AuthService] Erro ao gerar token JWT:`, {
        userId: user.id,
        username: user.username,
        error: error.message,
        stack: error.stack
      });
      throw new UnauthorizedException('Erro ao realizar login');
    }
  }

  async register(createUserDto: any) {
    try {
      console.log(`[AuthService] Iniciando processo de registro para:`, {
        username: createUserDto.username,
        email: createUserDto.email
      });

      // Verifica se o usuário já existe
      const existingUser = await this.usersService.findByUsername(createUserDto.username) ||
                          await this.usersService.findByEmail(createUserDto.email);
      
      if (existingUser) {
        console.log(`[AuthService] Tentativa de registro com dados já existentes:`, {
          username: createUserDto.username,
          email: createUserDto.email
        });
        throw new BadRequestException('Email ou username já cadastrado');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      console.log(`[AuthService] Usuário registrado com sucesso: ${user.username}`);
      return this.login(user);
    } catch (error) {
      console.error(`[AuthService] Erro ao registrar usuário:`, {
        username: createUserDto.username,
        email: createUserDto.email,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
} 