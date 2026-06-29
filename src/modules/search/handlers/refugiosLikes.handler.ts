import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RefugiosLikesHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    try {
      const data = await this.prisma.countLikesRefugios.findFirst({
        where: {
          refugioId: term,
        },
      });

      const refugiosLikes = data?.likes || 0;

      return { refugiosLikes };
    } catch (error) {
      console.error('Error en búsqueda de refugiosLikes:', error);
      throw new InternalServerErrorException(
        'Error en la búsqueda de refugiosLikes',
      );
    }
  }
}