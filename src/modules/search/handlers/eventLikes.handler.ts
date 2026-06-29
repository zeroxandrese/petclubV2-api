import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class EventLikesHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const data = await this.prisma.countLikesEvent.findFirst({
      where: { eventId: term },
    });

    return {
      eventLikes: data?.likes || 0,
    };
  }
}