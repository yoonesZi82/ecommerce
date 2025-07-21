import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import UserRoleEnum from '../enum/userRoleEnum';
import { passwordRegex, phoneRegex } from '@/regexs/regex-global';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'mobile must be a string' })
  @IsNotEmpty({ message: 'mobile is required' })
  @Matches(phoneRegex, { message: 'mobile number is not valid' })
  @Transform(({ value }) => value.trim())
  mobile: string;

  @IsString({ message: 'display_name must be a string' })
  @IsNotEmpty({ message: 'display_name is required' })
  @Transform(({ value }) => value.trim())
  display_name: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @Matches(passwordRegex, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsEnum(UserRoleEnum, {
    message: 'role must be a valid role (admin or user)',
  })
  @IsOptional()
  role: UserRoleEnum;
}
