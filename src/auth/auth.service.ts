import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import UserRoleEnum from '@/users/enum/userRoleEnum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const allUser = await this.usersService.findAll();
      const role =
        allUser.length === 0 ? UserRoleEnum.ADMIN : UserRoleEnum.USER;
      const hashPassword = await bcrypt.hash(registerDto.password, 12);
      await this.usersService.create({
        ...registerDto,
        password: hashPassword,
        role,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'user created successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException({
        statusCode: 500,
        message: 'something went wrong',
      });
    }
  }

  async login(loginDto: LoginDto) {
    const { mobile, password } = loginDto;
    try {
      const user = await this.usersService.findOneByMobile(mobile);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'password or mobile is incorrect',
        });
      }

      const payload = {
        id: user.id,
        role: user.role,
        mobile: user.mobile,
        display_name: user.display_name,
      };
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException({
        statusCode: 500,
        message: 'something went wrong',
        error: error.message,
      });
    }
  }
}
