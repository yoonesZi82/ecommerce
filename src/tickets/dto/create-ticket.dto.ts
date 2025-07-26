import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString({ message: 'subject must be string' })
  @IsNotEmpty({ message: 'subject is required' })
  subject: string;

  @IsString({ message: 'description must be string' })
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsInt({ message: 'user Id must be number' })
  @IsNotEmpty({ message: 'user Id is required' })
  userId: number;

  @IsOptional()
  replayTo: number;
}
