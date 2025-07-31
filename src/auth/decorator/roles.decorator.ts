import UserRoleEnum from '@/users/enum/userRoleEnum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';

export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
