import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class UsersHandler {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async search(term: string) {

    const isUUID = /^[0-9a-fA-F-]{36}$/.test(term);

    if (isUUID) {
      const user = await this.prisma.user.findUnique({
        where: { uid: term },
      });

      return user ? [user] : [];
    }

    return await this.prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { nombre: { contains: term, mode: 'insensitive' } },
              { email: { contains: term, mode: 'insensitive' } },
              { role: { contains: term, mode: 'insensitive' } },
            ],
          },
          { status: true },
        ],
      },
    });
  }
}