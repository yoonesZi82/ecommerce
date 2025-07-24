import { passwordRegex, phoneRegex } from '@/regexs/regex-global';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'mobile must be a string' })
  @IsNotEmpty({ message: 'mobile is required' })
  @Matches(phoneRegex, { message: 'mobile number is not valid' })
  @Transform(({ value }) => value.trim())
  mobile: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @Matches(passwordRegex, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @Transform(({ value }) => value.trim())
  password: string;
}
