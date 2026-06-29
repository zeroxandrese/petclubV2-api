import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { Express } from 'express';

@Injectable()
export class VerifyUploadFilePipe implements PipeTransform<Express.Multer.File> {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo.');
    }

    const allowedExt = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExt.includes(ext)) {
      throw new BadRequestException(`Archivo no permitido: ${ext}`);
    }

    return file
  }
}