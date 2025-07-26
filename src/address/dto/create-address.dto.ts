import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'province must be string' })
  @IsNotEmpty({ message: 'province is required' })
  province: string;

  @IsString({ message: 'city must be string' })
  @IsNotEmpty({ message: 'city is required' })
  city: string;

  @IsString({ message: 'postal code must be string' })
  @Matches(/^(\d{10})$/g, {
    message: 'postal code is must be 10 character',
  })
  postal_code: string;

  @IsString({ message: 'receiver mobile must be string' })
  @Matches(/^(\d{11})$/g, {
    message: 'receiver mobile is must be 10 character',
  })
  receiver_mobile: string;

  @IsString({ message: 'address must be string' })
  @IsNotEmpty({ message: 'address is required' })
  address: string;

  @IsString({ message: 'description must be string' })
  @IsOptional()
  description: string;

  @IsInt({ message: 'user Id must be number' })
  @IsNotEmpty({ message: 'user Id is required' })
  userId: number;
}
