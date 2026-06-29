import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CommentsCountHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    return await this.prisma.countComments.findMany({
      where: {
        OR: [{ user: term }],
        status: true,
      },
    });
  }
}