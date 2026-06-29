import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RankingHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const ranking = await this.prisma.ranking.findMany({
      where: { status: true },
      orderBy: { position: 'asc' },
      take: 10,
      select: {
        position: true,
        user: true,
      },
    });

    const userIds = ranking
      .map((item) => item.user)
      .filter((uid) => uid);

    const users = await this.prisma.user.findMany({
      where: {
        uid: { in: userIds },
      },
      select: {
        uid: true,
        nombre: true,
      },
    });

    const myPosition = await this.prisma.ranking.findMany({
      where: { user: term },
    });

    const rankingWithUsers = ranking.map((item) => {
      const user =
        users.find((u) => u.uid === item.user) || null;

      return {
        position: item.position,
        user,
      };
    });

    return {
      ranking: rankingWithUsers,
      myPosition,
    };
  }
}