import { IsInt } from 'class-validator';

export class VerifyPaymentDto {
  @IsInt({ message: 'track id must be number' })
  trackId: number;
}
