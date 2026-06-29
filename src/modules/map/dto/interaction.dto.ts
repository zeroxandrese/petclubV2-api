import { IsNotEmpty, IsInt } from 'class-validator';

export class InteractionDto {
  @IsNotEmpty()
  @IsInt()
  interaction: number;
}