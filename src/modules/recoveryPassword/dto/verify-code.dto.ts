import { IsNumber, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsNumber({}, { message: 'El código debe ser un número' })
  @IsNotEmpty({ message: 'Necesita enviar un código' })
  code!: number;
}