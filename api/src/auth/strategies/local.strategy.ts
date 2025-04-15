import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier',
      passwordField: 'password'
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    console.log(`[LocalStrategy] Tentando autenticar com identificador: ${identifier}`);
    const user = await this.authService.validateUser(identifier, password);
    if (!user) {
      console.log(`[LocalStrategy] Autenticação falhou para o identificador: ${identifier}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
    console.log(`[LocalStrategy] Autenticação bem-sucedida para o usuário: ${user.username}`);
    return user;
  }
} 