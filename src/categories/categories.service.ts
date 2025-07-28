import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
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

  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['products'],
      });
      return categories;
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
      const product = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      return product;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'something went wrong',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeOnlyCategory(id: number) {
    const category = await this.findOne(id);

    if (!category) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'category not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.categoryRepository.remove(category);
    return category;
  }
}
