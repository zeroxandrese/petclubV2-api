import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class NotificationsHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    return await this.prisma.notifications.findMany({
      where: {
        OR: [{ userSender: term }],
        status: true,
      },
    });
  }
}