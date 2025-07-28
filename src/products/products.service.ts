import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '@/categories/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(productRepository: CreateProductDto) {
    const { categoryIds, ...otherData } = productRepository;

    const findProduct = await this.productRepository.findOne({
      where: { title: otherData.title },
    });

    if (findProduct) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'product with this title is already',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = this.productRepository.create({ ...otherData });

    if (categoryIds && product) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });

      if (categories.length) {
        // await this.productRepository.update(product.id, { categories }); // OR
        product.categories = categories;
        await this.productRepository.save(product);
        return product;
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Not found categories',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async findAll() {
    const products = await this.productRepository.find({
      relations: ['categories'],
      order: {
        createdAt: 'DESC',
      },
    });
    return products;
  }

  async update(id: number, productRepository: UpdateProductDto) {
    const { categoryIds, ...otherData } = productRepository;
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['categories'],
      });

      if (!product) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'product is not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (otherData.title) product.title = otherData.title;
      if (otherData.price) product.price = otherData.price;
      if (otherData.description) product.description = otherData.description;
      if (otherData.stock) product.stock = otherData.stock;

      if (categoryIds) {
        const categories = await this.categoryRepository.findBy({
          id: In(categoryIds),
        });

        product.categories = categories;
      }
      await this.productRepository.save(product);
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

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['categories'],
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
}
