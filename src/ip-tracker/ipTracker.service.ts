import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IpTracker } from './entities/ipTracker.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 4;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 2;
  private readonly TEHRAN_TIMEZONE = 3.5 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(IpTracker)
    private readonly ipTrackerRepository: Repository<IpTracker>,
  ) {}

  async track(ip: string) {
    try {
      const nowTime = new Date();
      const nowTimeTh = new Date(nowTime.getTime() + this.TEHRAN_TIMEZONE);

      const record = await this.ipTrackerRepository.findOne({ where: { ip } });

      if (!record) {
        const newRecord = this.ipTrackerRepository.create({
          ip,
          requestCount: 1,
          windowStart: nowTime,
          isBlocked: false,
          blockUntil: null,
        });

        await this.ipTrackerRepository.save(newRecord);
        console.log(`${ip} first request sent`);
        return;
      }

      if (
        record.isBlocked &&
        record.blockUntil &&
        record.blockUntil > nowTime
      ) {
        throw new HttpException(
          {
            success: false,
            blocked: true,
            reason: 'Too many requests',
            message: `You are blocked for ${this.BLOCK_MINUTES} minute(s)`,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const windowEnd = new Date(
        record.windowStart.getTime() +
          this.WINDOW_MINUTES * 60 * 1000 +
          this.TEHRAN_TIMEZONE,
      );

      if (nowTimeTh > windowEnd) {
        record.requestCount = 1;
        record.windowStart = nowTime;
        record.isBlocked = false;
        record.blockUntil = null;
      } else {
        if (record.requestCount >= this.MAX_REQUESTS) {
          record.isBlocked = true;
          record.blockUntil = new Date(
            nowTime.getTime() + this.BLOCK_MINUTES * 60 * 1000,
          );
        } else {
          record.requestCount += 1;
        }
      }

      await this.ipTrackerRepository.save(record);
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
