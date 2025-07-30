import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from '@/ip-tracker/ipTracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService) {}

  use(req: Request, res: Response, next: () => void) {
    this.ipTrackerService.track(req.ip as string);
    next();
  }
}
