import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { VerifyPaymentDto } from './dto/verify-payment-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { amount } = createOrderDto;
    const payload = {
      merchant: 'zibal',
      amount: amount * 10,
      callbackUrl: 'https://manage-student-production.up.railway.app/',
    };

    const response = this.httpService.post(
      'https://gateway.zibal.ir/v1/request',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const transformResponse = await lastValueFrom(response);

    return transformResponse.data;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const { trackId } = verifyPaymentDto;

    const payload = {
      merchant: 'zibal',
      trackId,
    };

    const response = this.httpService.post(
      'https://gateway.zibal.ir/v1/verify',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const transformResponse = await lastValueFrom(response);

    return transformResponse.data;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
