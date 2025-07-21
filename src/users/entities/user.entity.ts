import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import UserRoleEnum from '../enum/userRoleEnum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mobile: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
