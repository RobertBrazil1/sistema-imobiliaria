import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    console.log('[RolesGuard] Roles necessárias:', requiredRoles);

    if (!requiredRoles) {
      console.log('[RolesGuard] Nenhuma role necessária, permitindo acesso');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('[RolesGuard] Usuário da requisição:', user);

    if (!user) {
      console.log('[RolesGuard] Usuário não autenticado');
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!user.role) {
      console.log('[RolesGuard] Usuário não possui role definida');
      throw new UnauthorizedException('Usuário não possui role definida');
    }

    const hasRole = requiredRoles.includes(user.role);
    console.log('[RolesGuard] Usuário tem a role necessária?', hasRole);

    if (!hasRole) {
      console.log('[RolesGuard] Usuário não tem permissão para acessar este recurso');
      throw new UnauthorizedException('Usuário não tem permissão para acessar este recurso');
    }

    return true;
  }
} 