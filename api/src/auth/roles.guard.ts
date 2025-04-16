import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      console.error('Usuário não encontrado na requisição');
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!user.role) {
      console.error('Role não definida para o usuário:', user);
      throw new ForbiddenException('Usuário não possui role definida');
    }

    // Superuser tem acesso a tudo
    if (user.role === Role.SUPERUSER) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      console.error('Usuário não possui a role necessária:', {
        requiredRoles,
        userRole: user.role
      });
      throw new ForbiddenException('Usuário não possui permissão para acessar este recurso');
    }

    return true;
  }
} 