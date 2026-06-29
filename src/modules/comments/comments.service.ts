import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const DEFAULT_PAWS = 1;

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // GET WITH PAGINATION
  // =========================
  async findByTarget(
    id: string,
    type: 'IMAGE' | 'NEWS',
    page = 1,
    limit = 15,
  ) {
    const where =
      type === 'IMAGE'
        ? { status: true, uidImg: id }
        : { status: true, uidNews: id };

    const totalDocs = await this.prisma.comments.count({ where });

    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await this.prisma.comments.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { charged: 'desc' },
    });

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  // =========================
  // CREATE
  // =========================
  async create(userId: string, dto: CreateCommentDto) {
    if (!dto.comments)
      throw new BadRequestException('Debe enviar un comentario');

    if (!dto.uidImg && !dto.uidNews)
      throw new BadRequestException('Debe enviar uidImg o uidNews');

    const comment = await this.prisma.comments.create({
      data: {
        user: userId,
        comments: dto.comments,
        uidImg: dto.uidImg,
        uidNews: dto.uidNews,
        contentType: dto.contentType ?? 'IMAGE',
      },
    });

    // 🔹 PAWS
    const paws = await this.prisma.pawsCount.findFirst({
      where: { user: userId },
    });

    if (!paws) {
      await this.prisma.pawsCount.create({
        data: {
          user: userId,
          paws: DEFAULT_PAWS,
          lastUpdate: new Date(),
        },
      });
    } else {
      await this.prisma.pawsCount.update({
        where: { uid: paws.uid },
        data: {
          paws: { increment: DEFAULT_PAWS },
          lastUpdate: new Date(),
        },
      });
    }

    // 🔹 COUNT COMMENTS
    const count = await this.prisma.countComments.findFirst({
      where: { user: userId },
    });

    if (!count) {
      await this.prisma.countComments.create({
        data: {
          user: userId,
          comments: 1,
          lastUpdate: new Date(),
        },
      });
    } else {
      await this.prisma.countComments.update({
        where: { uid: count.uid },
        data: {
          comments: { increment: 1 },
          lastUpdate: new Date(),
        },
      });
    }

    return comment;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: string, dto: UpdateCommentDto) {
    const exists = await this.prisma.comments.findUnique({
      where: { uid: id },
    });

    if (!exists) throw new NotFoundException('Comentario no encontrado');

    return this.prisma.comments.update({
      where: { uid: id },
      data: { comments: dto.comments },
    });
  }

  // =========================
  // SOFT DELETE
  // =========================
  async remove(id: string) {
    const exists = await this.prisma.comments.findUnique({
      where: { uid: id },
    });

    if (!exists) throw new NotFoundException('Comentario no encontrado');

    return this.prisma.comments.update({
      where: { uid: id },
      data: { status: false },
    });
  }
}