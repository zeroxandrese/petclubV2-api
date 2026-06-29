import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BusinessFavoriteHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    try {
      const [
        likedCenterVets,
        likedPetShops,
        likedEvents,
        likedRefugios,
      ] = await Promise.all([
        this.prisma.likesCenterVet.findMany({ where: { user: term } }),
        this.prisma.likesPetshops.findMany({ where: { user: term } }),
        this.prisma.likesEvent.findMany({ where: { user: term } }),
        this.prisma.likesRefugios.findMany({ where: { user: term } }),
      ]);

      const [centerVets, petShops, events, refugios] = await Promise.all([
        this.prisma.elementMapcenterVet.findMany({
          where: {
            uid: { in: likedCenterVets.map(i => i.centerVetId) },
          },
        }),
        this.prisma.elementMapPetshops.findMany({
          where: {
            uid: { in: likedPetShops.map(i => i.petshopId) },
          },
        }),
        this.prisma.elementMapEvent.findMany({
          where: {
            uid: { in: likedEvents.map(i => i.eventId) },
          },
        }),
        this.prisma.elementMapRefugios.findMany({
          where: {
            uid: { in: likedRefugios.map(i => i.refugioId) },
          },
        }),
      ]);

      const combined = [
        ...centerVets.map(item => ({
          id: item.uid,
          type: 'centerVet',
          data: item,
        })),
        ...petShops.map(item => ({
          id: item.uid,
          type: 'petShop',
          data: item,
        })),
        ...events.map(item => ({
          id: item.uid,
          type: 'event',
          data: item,
        })),
        ...refugios.map(item => ({
          id: item.uid,
          type: 'refugio',
          data: item,
        })),
      ];

      const unique = Array.from(
        new Map(combined.map(item => [item.id, item])).values(),
      );

      const shuffled = unique
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      return { businessFavorites: shuffled };
    } catch (error) {
      console.error('Error en búsqueda de business favorite:', error);
      throw new InternalServerErrorException(
        'Error en la búsqueda de business favorite',
      );
    }
  }
}