import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const DEFAULT_PAWS = 1;

@Injectable()
export class CommentsChildrenService {
  constructor(private prisma: PrismaService) {}

  async getByFather(id: string, page?: string) {
    const pageNumber = parseInt(page || '1', 10) || 1;
    const pageSize = 500;

    const totalDocs = await this.prisma.commentsChildren.count({
      where: {
        status: true,
        uidCommentsFather: id,
      },
    });

    const totalPages = Math.ceil(totalDocs / pageSize);

    const docs = await this.prisma.commentsChildren.findMany({
      where: {
        status: true,
        uidCommentsFather: id,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: {
        charged: 'desc',
      },
    });

    return {
      docs,
      totalDocs,
      limit: pageSize,
      totalPages,
      page: pageNumber,
      pagingCounter: (pageNumber - 1) * pageSize + 1,
      hasPrevPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    };
  }

  async update(id: string, comments: string) {
    if (!comments) {
      throw new BadRequestException('Comentario vacío');
    }

    return this.prisma.commentsChildren.update({
      where: { uid: id },
      data: { comments },
    });
  }

  async create(fatherId: string, comments: string, user: any) {
    if (!comments) {
      throw new BadRequestException(
        'Necesita cargar un comentario',
      );
    }

    const commentChildren =
      await this.prisma.commentsChildren.create({
        data: {
          user: user.uid,
          uidCommentsFather: fatherId,
          comments,
        },
      });

    // =========================
    // PAWS COUNT
    // =========================

    const paws = await this.prisma.pawsCount.findFirst({
      where: { user: user.uid },
    });

    if (!paws) {
      await this.prisma.pawsCount.create({
        data: {
          user: user.uid,
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

    // =========================
    // COUNT COMMENTS
    // =========================

    const count = await this.prisma.countComments.findFirst({
      where: { user: user.uid },
    });

    if (!count) {
      await this.prisma.countComments.create({
        data: {
          user: user.uid,
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

    // =========================
    // TASKS
    // =========================

    const tasks = await this.prisma.tasks.findMany({
      where: {
        type: 1,
        status: true,
      },
    });

    for (const task of tasks) {
      const taskUser =
        await this.prisma.tasksByUser.findFirst({
          where: {
            user: user.uid,
            uidTask: task.uid,
            type: 1,
          },
        });

      if (taskUser) {
        await this.prisma.tasksByUser.update({
          where: { uid: taskUser.uid },
          data: {
            lastUpdate: new Date(),
            point: { increment: 1 },
          },
        });
      } else {
        await this.prisma.tasksByUser.create({
          data: {
            user: user.uid,
            uidTask: task.uid,
            type: 1,
            point: 1,
            lastUpdate: new Date(),
          },
        });
      }
    }

    return commentChildren;
  }

  async softDelete(id: string) {
    return this.prisma.commentsChildren.update({
      where: { uid: id },
      data: { status: false },
    });
  }
}