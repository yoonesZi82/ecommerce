import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsInt({ message: 'price must be a number' })
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsString({ message: 'description must be string' })
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsInt({ message: 'stock must be a number' })
  @IsNotEmpty({ message: 'stock is required' })
  stock: number;

  @IsOptional()
  @IsArray()
  categoryIds: number[];
}
