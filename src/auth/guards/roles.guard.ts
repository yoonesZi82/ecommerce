import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import UserRoleEnum from '@/users/enum/userRoleEnum';
import PayloadType from '../types/payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) return true;

    const { user }: { user: PayloadType } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) throw new ForbiddenException('You are not access this route');

    return true;
  }
}
