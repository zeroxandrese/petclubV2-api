import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TokenHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const tokens = await this.prisma.tokenPoint.findMany({
      where: { user: term },
    });

    return {
      points: tokens.map((item) => item.points),
    };
  }
}