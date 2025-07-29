import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IpTrackerService {
  test(req: Request) {
    console.log(req.ip);
  }
}
