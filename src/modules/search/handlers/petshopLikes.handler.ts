import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PetshopLikesHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const data = await this.prisma.countLikesPetshop.findFirst({
      where: { petshopId: term },
    });

    return {
      petshopLikes: data?.likes || 0,
    };
  }
}