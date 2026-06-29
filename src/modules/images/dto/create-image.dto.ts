import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsMongoId,
} from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsMongoId()
  pet?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaEvento?: Date;

  @IsOptional()
  @IsNumber()
  longitudeEvento?: number;

  @IsOptional()
  @IsNumber()
  lantitudeEvento?: number;

  @IsOptional()
  @IsString()
  horaEvento?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  namePet?: string;

  @IsOptional()
  @IsString()
  finalUserVisibleAddress?: string;

  @IsOptional()
  @IsString()
  finalUserVisibleDate?: string;

}