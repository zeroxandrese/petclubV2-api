import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CenterVetLikesHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    try {
      const data = await this.prisma.countLikesCenterVet.findFirst({
        where: {
          centerVetId: term,
        },
      });

      const centervetLikes = data?.likes || 0;

      return { centervetLikes };
    } catch (error) {
      console.error('Error en búsqueda de centerVet:', error);
      throw new InternalServerErrorException(
        'Error en la búsqueda de centerVet',
      );
    }
  }
}