import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsString({ message: 'La nota debe ser texto' })
  @IsNotEmpty({ message: 'Necesita enviar una interacción (note)' })
  note!: string;
}