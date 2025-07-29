import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Response } from 'express';
import { VerifyPaymentDto } from './dto/verify-payment-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('payment')
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const response = await this.ordersService.create(createOrderDto);
    const paymentUrl = `https://gateway.zibal.ir/start/${response.trackId}`;
    // res.redirect(paymentUrl);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'success',
      data: {
        ...response,
        paymentUrl,
      },
    });
  }

  @Post('verify-payment')
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @Res() res: Response,
  ) {
    const response = await this.ordersService.verifyPayment(verifyPaymentDto);
    // res.redirect(paymentUrl);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: response.result === 100 ? 'success' : 'failed',
      data: {
        ...response,
      },
    });
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
