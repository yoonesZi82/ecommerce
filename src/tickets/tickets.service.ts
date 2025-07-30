import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    try {
      const { userId, replayTo, ...otherData } = createTicketDto;
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const replayToTicket = await this.ticketRepository.findOne({
        where: { id: replayTo },
        relations: ['replayTo'],
      });

      if (replayTo && !replayToTicket) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'ticket not found for replay',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (replayTo && replayToTicket?.replayTo) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'this ticket can not have a replay message',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const ticket = this.ticketRepository.create({
        ...otherData,
        user,
        replayTo: replayToTicket || undefined,
      });
      await this.ticketRepository.save(ticket);
      return ticket;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'something went wrong',
        error: error.message,
      });
    }
  }

  findAllTicket() {
    try {
      const query = this.ticketRepository.createQueryBuilder('tickets');
      const tickets = query.where('tickets.replayToId IS NULL').getMany();

      return tickets;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'something went wrong',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['replies', 'replayTo'],
      });
      return ticket;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'something went wrong',
        error: error.message,
      });
    }
  }
}
