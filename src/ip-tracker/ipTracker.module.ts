import { Module } from '@nestjs/common';
import { IpTrackerService } from './ipTracker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpTracker } from './entities/ipTracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpTracker])],
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
