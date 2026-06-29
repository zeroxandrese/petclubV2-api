import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  comments: string;
}