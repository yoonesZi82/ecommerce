import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoleEnum from './enum/userRoleEnum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { mobile } = createUserDto;
      const userExists = await this.usersRepository.findOne({
        where: { mobile },
      });

      if (userExists) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'user already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = this.usersRepository.create(createUserDto);

      return await this.usersRepository.save(user);
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

  async findAll(role?: UserRoleEnum, page: number = 1, limit: number = 8) {
    try {
      const query = this.usersRepository
        .createQueryBuilder('users')
        .orderBy('createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (role) {
        query.andWhere('role = :role', { role });
      }

      const users = await query.getMany();
      return users;
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

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['baskets'],
      });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
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

  async findOneByMobile(mobile: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { mobile } });
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'password or mobile is incorrect',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
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

  async addProductToBasket(userId: number, product) {
    const user = await this.findOne(userId);
    user.baskets.push(product);
    return await this.usersRepository.save(user);
  }

  async RemoveProductFromBasket(userId: number, product) {
    const user = await this.findOne(userId);
    const productIndex = user.baskets.findIndex(
      (item) => item.id === product.id,
    );

    user.baskets.splice(productIndex, 1);
    return await this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersRepository.update(id, updateUserDto);
      return true;
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

  async remove(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersRepository.delete(id);
      return true;
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
