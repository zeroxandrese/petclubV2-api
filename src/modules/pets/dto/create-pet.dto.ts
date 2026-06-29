// src/pets/dto/create-pet.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsNotEmpty()
  @IsString()
  tipo!: string;

  @IsOptional()
  @IsDateString()
  edad?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  img?: string; // URL de Cloudinary

  // Campos para reporte de perdida (opcional en create)
  @IsOptional()
  @IsBoolean()
  perdido?: boolean;

  @IsOptional()
  @IsDateString()
  fechaPerdida?: string;

  @IsOptional()
  @IsString()
  horaPerdida?: string;

  @IsOptional()
  @IsNumber()
  longitudePerdida?: number;

  @IsOptional()
  @IsNumber()
  lantitudePerdida?: number;
}
