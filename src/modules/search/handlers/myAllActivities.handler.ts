import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MyAllActivitiesHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const countComments = await this.prisma.countComments.findMany({
      where: { user: term, status: true },
      select: { comments: true },
    });

    const countImage = await this.prisma.countImage.findMany({
      where: { user: term, status: true },
      select: { images: true },
    });

    const countVideos = await this.prisma.countVideos.findMany({
      where: { user: term, status: true },
      select: { videos: true },
    });

    const likesCount = await this.prisma.countLikes.count({
      where: { user: term, status: true },
    });

    const likesCountForMe = await this.prisma.countLikes.count({
      where: { userSender: term, status: true },
    });

    const totalComments = countComments.reduce(
      (sum, item) => sum + (item.comments || 0),
      0,
    );

    const totalImages = countImage.reduce(
      (sum, item) => sum + (item.images || 0),
      0,
    );

    const totalVideos = countVideos.reduce(
      (sum, item) => sum + (item.videos || 0),
      0,
    );

    return {
      comments: totalComments,
      images: totalImages,
      videos: totalVideos,
      likes: likesCount,
      likesForMe: likesCountForMe,
    };
  }
}