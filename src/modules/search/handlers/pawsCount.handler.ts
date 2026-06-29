import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PawsCountHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const pawCount = await this.prisma.pawsCount.findMany({
      where: {
        OR: [{ user: term }],
        status: true,
      },
    });

    const totalPaws = pawCount.reduce(
      (acc, item) => acc + (item.paws || 0),
      0,
    );

    return { points: totalPaws };
  }
}