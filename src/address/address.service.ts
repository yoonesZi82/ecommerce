import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      const { userId, city, postal_code, province } = createAddressDto;
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const addressExist = await this.addressRepository.findOne({
        where: {
          city,
          postal_code,
          province,
          user: { id: userId },
        },
      });

      if (addressExist) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'address already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const address = this.addressRepository.create({
        ...createAddressDto,
        user,
      });

      const addressCreate = await this.addressRepository.save(address);

      return addressCreate;
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

  async findAll(page: number = 1, limit: number = 8) {
    try {
      const query = this.addressRepository
        .createQueryBuilder('address')
        .innerJoinAndSelect('address.user', 'userId')
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('address.createdAt', 'DESC');

      const addresses = await query.getMany();

      return addresses;
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
      const address = await this.addressRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!address) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'address is not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return address;
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

  async findByUserId(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'user is not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const addresses = await this.addressRepository.find({
        where: {
          user: { id },
        },
      });

      return addresses;
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

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      const address = await this.addressRepository.findOne({ where: { id } });

      if (!address) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'address is not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.addressRepository.update(address.id, updateAddressDto);

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
      const address = await this.addressRepository.findOne({ where: { id } });

      if (!address) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'address is not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.addressRepository.delete(address.id);
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
