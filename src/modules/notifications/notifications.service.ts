import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async markAsSeen(id: string) {
    try {
      const notification = await this.prisma.notifications.update({
        where: { uid: id },
        data: { statusSeen: true },
      });

      return notification;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('La notificación no existe');
        }
      }
      
      console.error('Error actualizando notificación:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}