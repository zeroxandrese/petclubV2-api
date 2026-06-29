import { IsMongoId } from 'class-validator';

export class NotificationParamDto {
  @IsMongoId({ message: 'El id no es válido' })
  id!: string;
}