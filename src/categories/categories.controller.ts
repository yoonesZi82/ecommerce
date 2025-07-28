import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);
    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'category is create successfully',
      data: category,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'categories fetch successfully',
      data: categories,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const product = await this.categoriesService.findOne(id);
    res.status(product ? HttpStatus.OK : HttpStatus.NOT_FOUND).json({
      statusCode: product ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: product ? 'find category successfully' : 'category not found',
      data: product || null,
    });
  }

  @Delete(':id')
  async removeOnlyCategory(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.categoriesService.removeOnlyCategory(id);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'remove category successfully',
    });
  }
}
