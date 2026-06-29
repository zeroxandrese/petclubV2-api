import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class VideosCountHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    return await this.prisma.countVideos.findMany({
      where: {
        OR: [{ user: term }],
        status: true,
      },
    });
  }
}