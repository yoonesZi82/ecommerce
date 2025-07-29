import { IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: 'amount must be number' })
  amount: number;
}
