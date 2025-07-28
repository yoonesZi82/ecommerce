import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title: string;

  @IsInt({ message: 'price must be a number' })
  @IsOptional()
  price: number;

  @IsString({ message: 'description must be string' })
  @IsOptional()
  description: string;

  @IsInt({ message: 'stock must be a number' })
  @IsOptional()
  stock: number;

  @IsOptional()
  @IsArray()
  categoryIds: number[];
}
