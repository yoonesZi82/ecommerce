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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '09912209730', description: 'mobile' })
  @IsString({ message: 'mobile must be a string' })
  @IsNotEmpty({ message: 'mobile is required' })
  @Matches(phoneRegex, { message: 'mobile number is not valid' })
  @Transform(({ value }) => value.trim())
  mobile: string;

  @ApiProperty({ example: 'yoones', description: 'name' })
  @IsString({ message: 'display_name must be a string' })
  @Transform(({ value }) => value.trim())
  display_name: string;

  @ApiProperty({ example: '12345678aA!', description: 'password' })
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

  @ApiPropertyOptional({
    enum: UserRoleEnum,
    example: UserRoleEnum.USER,
    description: 'role',
  })
  @IsEnum(UserRoleEnum, {
    message: 'role must be a valid role (admin or user)',
  })
  @IsOptional()
  role: UserRoleEnum;
}
