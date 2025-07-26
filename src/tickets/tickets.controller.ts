import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Response } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAllTicket() {
    return this.ticketsService.findAllTicket();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const ticket = await this.ticketsService.findOne(id);
    return res.status(ticket ? HttpStatus.OK : HttpStatus.NOT_FOUND).json({
      statusCode: ticket ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      message: ticket ? 'ticket is found it' : 'ticket is not found',
      data: ticket ? ticket : null,
    });
  }
}
