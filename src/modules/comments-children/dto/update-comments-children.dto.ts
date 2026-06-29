import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentsChildrenDto {
  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  @IsString({ message: 'El comentario debe ser un string' })
  comments: string;
}