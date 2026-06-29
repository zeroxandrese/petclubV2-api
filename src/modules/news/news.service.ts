import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNewsDto) {
    return this.prisma.news.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.news.findMany({
      where: { status: true },
      orderBy: { charged: 'desc' },
    });
  }

  async findOne(uid: string) {
    return this.prisma.news.findUnique({
      where: { uid },
    });
  }

  async deactivate(uid: string) {
    return this.prisma.news.update({
      where: { uid },
      data: { status: false },
    });
  }
}