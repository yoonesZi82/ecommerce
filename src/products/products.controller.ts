import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Response } from 'express';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productsService.create(createProductDto);
    return res
      .status(product ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
      .json({
        statusCode: product ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
        message: product
          ? 'Create product successfully'
          : 'Product can not created',
        data: product ?? null,
      });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'fetch products successfully',
      data: products,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const product = await this.productsService.findOne(id);
    res.status(product ? HttpStatus.OK : HttpStatus.NOT_FOUND).json({
      statusCode: product ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: product ? 'find product successfully' : 'product not found',
      data: product || null,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'update product successfully',
      data: product,
    });
  }

  @Post('add-to-basket')
  async addItemToBasket(
    @Body() addToBasketItem: { userId: number; productId: number },
    @Res() res: Response,
  ) {
    const product = await this.productsService.addItemToBasket(
      addToBasketItem.userId,
      addToBasketItem.productId,
    );
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'product add ro basket successfully',
      data: product,
    });
  }

  @Delete('remove-from-basket')
  async removeProductFromBasket(
    @Body() itemForRemove: { userId: number; productId: number },
    @Res() res: Response,
  ) {
    await this.productsService.removeProductFromBasket(
      itemForRemove.userId,
      itemForRemove.productId,
    );

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'product delete from basket successfully',
      data: null,
    });
  }
}
