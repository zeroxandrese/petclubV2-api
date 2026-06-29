import { IsNotEmpty, IsInt } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  @IsInt()
  like: number;
}