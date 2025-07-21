import { IsOptional, IsEnum, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import UserRoleEnum from '../enum/userRoleEnum';

export class UserQueryDto {
  @IsOptional()
  @IsEnum(UserRoleEnum, {
    message: 'Role must be one of the following: user, admin',
  })
  role?: UserRoleEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 8;
}
