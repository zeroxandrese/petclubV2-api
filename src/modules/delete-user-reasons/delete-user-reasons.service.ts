import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeleteUserReasonsDto } from './dto/create-delete-user-reasons.dto';

@Injectable()
export class DeleteUserReasonsService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, dto: CreateDeleteUserReasonsDto) {
    const { alert, note } = dto;

    if (!note) {
      throw new BadRequestException('Necesita enviar una interacción');
    }

    await this.prisma.deleteUserReasons.create({
      data: {
        user: user.uid,
        alert,
        note,
      },
    });

    await this.prisma.user.update({
      where: { uid: user.uid },
      data: { status: false },
    });

    return {
      msg: 'Razones de eliminación enviadas de manera satisfactoria',
    };
  }

  async restore(user: any) {
    try {
      const existing = await this.prisma.deleteUserReasons.findFirst({
        where: {
          user: user.uid,
          status: true,
        },
      });

      if (!existing) {
        throw new UnauthorizedException('Usuario no identificado');
      }

      await this.prisma.deleteUserReasons.update({
        where: { uid: existing.uid },
        data: { status: false },
      });

      const userReturn = await this.prisma.user.update({
        where: { uid: user.uid },
        data: { status: true },
      });

      return userReturn;
    } catch (error) {
      throw new InternalServerErrorException('Error contacte al admin');
    }
  }
}