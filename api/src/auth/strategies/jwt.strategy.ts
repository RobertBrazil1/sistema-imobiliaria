import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Validando payload:', payload);
    
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      console.log('[JwtStrategy] Usuário não encontrado para o ID:', payload.sub);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    console.log('[JwtStrategy] Usuário validado com sucesso:', {
      id: user.id,
      username: user.username,
      role: user.role
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  }
} 