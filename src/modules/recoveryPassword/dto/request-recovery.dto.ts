import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestRecoveryDto {
  @IsEmail({}, { message: 'El correo debe ser válido' })
  @IsNotEmpty()
  email!: string;
}