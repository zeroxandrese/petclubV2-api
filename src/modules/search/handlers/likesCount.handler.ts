import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LikesCountHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const likesCount = await this.prisma.countLikes.count({
      where: {
        OR: [{ user: term }],
        status: true,
      },
    });

    const likesCountForMe = await this.prisma.countLikes.count({
      where: {
        OR: [{ userSender: term }],
        status: true,
      },
    });

    return {
      likesCount,
      likesCountForMe,
    };
  }
}