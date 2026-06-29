import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  bigUrlshort: string;

  @IsOptional()
  @IsString()
  smallUrlshort?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  actionPlan?: string;
}