import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @Matches(/^(\d{10})$/g, {
    message: 'postal code is must be 10 character',
  })
  postal_code: string;

  @IsString()
  @Matches(/^(\d{11})$/g, {
    message: 'receiver mobile is must be 10 character',
  })
  receiver_mobile: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  description: string;
}
