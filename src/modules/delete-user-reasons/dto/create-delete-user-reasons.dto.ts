import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';

export class CreateDeleteUserReasonsDto {
  @IsOptional()
  @IsInt()
  alert?: number;

  @IsNotEmpty({ message: 'Necesita enviar una interacción' })
  @IsString()
  note: string;
}