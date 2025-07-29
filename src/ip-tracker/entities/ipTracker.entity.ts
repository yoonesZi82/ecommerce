import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ip-trackers' })
export class IpTracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  windowStart: Date;

  @Column()
  requestCount: number;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  blockUntil: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
