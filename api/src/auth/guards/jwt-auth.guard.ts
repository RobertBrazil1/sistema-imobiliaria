import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log('[JwtAuthGuard] Erro na autenticação:', err || info);
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    console.log('[JwtAuthGuard] Verificando autenticação');
    
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    console.log('[JwtAuthGuard] Roles necessárias:', requiredRoles);

    return super.canActivate(context);
  }
} 