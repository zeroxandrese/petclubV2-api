import { IsOptional, IsString, IsIn } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  comments: string;

  @IsOptional()
  @IsString()
  uidImg?: string;

  @IsOptional()
  @IsString()
  uidNews?: string;

  @IsOptional()
  @IsIn(['IMAGE', 'NEWS'])
  contentType?: 'IMAGE' | 'NEWS';
}