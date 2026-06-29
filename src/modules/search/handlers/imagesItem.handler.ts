import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ImagesItemHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const image = await this.prisma.image.findUnique({
      where: { uid: term },
    });

    return image ? [image] : [];
  }
}