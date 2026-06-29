import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import uploadFileValidation from '../../common/helpers/upload-file';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_name,
  api_key: process.env.CLOUDINARY_apikey,
  api_secret: process.env.CLOUDINARY_apisecret,
  secure: true,
});

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async cloudinaryUploadFile(
    collection: string,
    id: string,
    file: Express.Multer.File,
    userAuth: any,
  ) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('ID no válido');
    }

    const uidUpdate = String(userAuth.uid);
    let modelo: any;

    switch (collection) {
      case 'users':
        modelo = await this.prisma.user.findUnique({ where: { uid: id } });
        if (!modelo) throw new BadRequestException('El UUID no existe');
        if (modelo.uid !== uidUpdate)
          throw new UnauthorizedException('El UID no corresponde');
        break;

      case 'images':
        modelo = await this.prisma.image.findUnique({ where: { uid: id } });
        if (!modelo) throw new BadRequestException('El UUID no existe');
        break;

      case 'pets':
        modelo = await this.prisma.pet.findUnique({ where: { uid: id } });
        if (!modelo) throw new BadRequestException('El UUID no existe');
        if (modelo.user !== uidUpdate)
          throw new UnauthorizedException('El UID no corresponde');
        break;

      default:
        throw new BadRequestException('Colección no permitida');
    }

    // borrar imagen anterior si existe
    if (modelo.img) {
      const publicId = modelo.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const nameValidation = uploadFileValidation(file);
    if (!nameValidation) {
      throw new BadRequestException('Extensión no permitida');
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'image_profile' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    const { secure_url } = uploadResult;

    switch (collection) {
      case 'users':
        await this.prisma.user.update({
          where: { uid: id },
          data: { img: secure_url },
        });
        break;

      case 'images':
        await this.prisma.image.update({
          where: { uid: id },
          data: { img: secure_url },
        });
        break;

      case 'pets':
        await this.prisma.pet.update({
          where: { uid: id },
          data: { img: secure_url },
        });
        break;
    }

    return { secure_url };
  }

  async getUpload(collection: string, id: string) {
    let modelo;

    switch (collection) {
      case 'users':
        modelo = await this.prisma.user.findUnique({ where: { uid: id } });
        break;

      case 'images':
        modelo = await this.prisma.image.findUnique({ where: { uid: id } });
        break;

      case 'pets':
        modelo = await this.prisma.pet.findUnique({ where: { uid: id } });
        break;

      default:
        throw new BadRequestException('Colección no permitida');
    }

    if (!modelo) {
      throw new BadRequestException('El UUID no existe');
    }

    return modelo;
  }
}