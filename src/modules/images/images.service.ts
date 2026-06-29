import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

import { CreateImageDto } from './dto/create-image.dto';

const DEFAULT_PAWSVIDEO = 5;
const DEFAULT_PAWSIMAGE = 4;

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) { }

  async getImages(page = '1') {
    const pageNumber = parseInt(page, 10) || 1;

    const pageSize = 20;
    const imageRatio = 0.7;
    const newsRatio = 0.3;

    const imageTake = Math.round(pageSize * imageRatio); 
    const newsTake = pageSize - imageTake;           

    const imageSkip = (pageNumber - 1) * imageTake;
    const newsSkip = (pageNumber - 1) * newsTake;

    const [images, news] = await Promise.all([
      this.prisma.image.findMany({
        where: { status: true },
        orderBy: { charged: 'desc' },
        skip: imageSkip,
        take: imageTake,
        select: {
          uid: true,
          img: true,
          descripcion: true,
          charged: true,
          bigUrlshort: true,
          smallUrlshort: true,
        },
      }),

      this.prisma.news.findMany({
        where: { status: true },
        orderBy: { charged: 'desc' },
        skip: newsSkip,
        take: newsTake,
        select: {
          uid: true,
          title: true,
          descripcion: true,
          bigUrlshort: true,
          smallUrlshort: true,
          charged: true,
        },
      }),
    ]);

    const mappedImages = images.map(i => ({
      uid: i.uid,
      type: 'IMAGE',
      img: i.img,
      descripcion: i.descripcion,
      charged: i.charged,
      bigUrlshort: i.bigUrlshort,
      smallUrlshort: i.smallUrlshort,
    }));

    const mappedNews = news.map(n => ({
      uid: n.uid,
      type: 'NEWS',
      img: n.bigUrlshort,
      descripcion: n.title,
      charged: n.charged,
      bigUrlshort: n.bigUrlshort,
      smallUrlshort: n.smallUrlshort,
    }));

    let merged = [...mappedImages, ...mappedNews];

    if (merged.length < pageSize) {
      const faltan = pageSize - merged.length;

      const extraImages = await this.prisma.image.findMany({
        where: { status: true },
        orderBy: { charged: 'desc' },
        take: faltan,
        select: {
          uid: true,
          img: true,
          descripcion: true,
          charged: true,
          bigUrlshort: true,
          smallUrlshort: true,
        },
      });

      merged = merged.concat(
        extraImages.map(i => ({
          uid: i.uid,
          type: 'IMAGE',
          img: i.img,
          descripcion: i.descripcion,
          charged: i.charged,
          bigUrlshort: i.bigUrlshort,
          smallUrlshort: i.smallUrlshort,
        }))
      );
    }

    // =========================
    // SHUFFLE ESTABLE POR PAGINA
    // =========================

    const shuffled = this.seededShuffle(merged, pageNumber);

    const docs = shuffled.slice(0, pageSize);

    // =========================
    // TOTALES
    // =========================

    const [totalImages, totalNews] = await Promise.all([
      this.prisma.image.count({ where: { status: true } }),
      this.prisma.news.count({ where: { status: true } }),
    ]);

    const totalDocs = totalImages + totalNews;

    return {
      docs,
      page: pageNumber,
      totalDocs,
      totalPages: Math.ceil(totalDocs / pageSize),
      hasNextPage: pageNumber * pageSize < totalDocs,
    };
  }

  // =========================
  // CREATE
  // =========================

  async createImage(
    userId: string,
    dto: CreateImageDto,
    file: Express.Multer.File,
  ) {
    try {
      const ext = file.originalname.split('.').pop()?.toLowerCase();

      if (!ext) throw new BadRequestException('Archivo inválido');

      if (ext === 'mp4' || ext === 'mov') {
        return this.uploadVideo(userId, dto, file);
      }

      return this.uploadImage(userId, dto, file);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error subiendo archivo');
    }
  }

  // =========================
  // IMAGE UPLOAD
  // =========================

  private async uploadImage(
    userId: string,
    dto: CreateImageDto,
    file: Express.Multer.File,
  ) {

    const upload = await cloudinary.uploader.upload(file.path, {
      folder: 'image_general',
    });

    const publicId = upload.public_id;

    const bigUrl = cloudinary.url(publicId, {
      transformation: [
        { aspect_ratio: '1.0', height: 506, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    const smallUrl = cloudinary.url(publicId, {
      transformation: [
        { width: 104, height: 104, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    const image = await this.prisma.image.create({
      data: {
        user: userId,
        img: upload.secure_url,
        bigUrlshort: bigUrl,
        smallUrlshort: smallUrl,
        descripcion: dto.descripcion ?? '',
        actionPlan: 'IMAGE',
      },
    });

    await this.addPaws(userId, DEFAULT_PAWSIMAGE);
    await this.incrementImageCount(userId);
    await this.updateTasks(userId, 2);

    return image;
  }

  // =========================
  // VIDEO UPLOAD
  // =========================

  private async uploadVideo(
    userId: string,
    dto: CreateImageDto,
    file: Express.Multer.File,
  ) {
    const stats = fs.statSync(file.path);
    const MAX_SIZE = 100 * 1024 * 1024;

    if (stats.size > MAX_SIZE) {
      throw new BadRequestException('Video demasiado grande');
    }

    const upload = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      chunk_size: 6000000,
      transformation: [{ quality: 'auto', format: 'mp4' }],
      eager: [
        {
          transformation: [
            { start_offset: '0', end_offset: '8', format: 'mp4', quality: 'auto' },
          ],
        },
        {
          transformation: [
            { width: 104, height: 104, crop: 'fill', format: 'jpg' },
          ],
        },
      ],
      folder: 'video_general',
    });

    const image = await this.prisma.image.create({
      data: {
        user: userId,
        img: upload.secure_url,
        bigUrlshort: upload.eager?.[0]?.secure_url,
        smallUrlshort: upload.eager?.[1]?.secure_url,
        descripcion: dto.descripcion ?? '',
        actionPlan: 'IMAGE',
      },
    });

    await this.addPaws(userId, DEFAULT_PAWSVIDEO);
    await this.incrementVideoCount(userId);
    await this.updateTasks(userId, 3);

    return image;
  }

  // =========================
  // PAWS
  // =========================

  private async addPaws(userId: string, paws: number) {
    const record = await this.prisma.pawsCount.findFirst({
      where: { user: userId },
    });

    if (!record) {
      await this.prisma.pawsCount.create({
        data: { user: userId, paws, lastUpdate: new Date() },
      });
    } else {
      await this.prisma.pawsCount.update({
        where: { uid: record.uid },
        data: {
          paws: (record.paws ?? 0) + paws,
          lastUpdate: new Date(),
        },
      });
    }
  }

  // =========================
  // COUNTS
  // =========================

  private async incrementVideoCount(userId: string) {
    const rec = await this.prisma.countVideos.findFirst({ where: { user: userId } });

    if (!rec) {
      await this.prisma.countVideos.create({
        data: { user: userId, videos: 1, lastUpdate: new Date() },
      });
    } else {
      await this.prisma.countVideos.update({
        where: { uid: rec.uid },
        data: { videos: (rec.videos ?? 0) + 1, lastUpdate: new Date() },
      });
    }
  }

  private async incrementImageCount(userId: string) {
    const rec = await this.prisma.countImage.findFirst({ where: { user: userId } });

    if (!rec) {
      await this.prisma.countImage.create({
        data: { user: userId, images: 1, lastUpdate: new Date() },
      });
    } else {
      await this.prisma.countImage.update({
        where: { uid: rec.uid },
        data: { images: (rec.images ?? 0) + 1, lastUpdate: new Date() },
      });
    }
  }

  // =========================
  // TASKS
  // =========================

  private async updateTasks(userId: string, type: number) {
    const tasks = await this.prisma.tasks.findMany({
      where: { type, status: true },
    });

    for (const task of tasks) {
      const existing = await this.prisma.tasksByUser.findMany({
        where: { user: userId, uidTask: task.uid, type },
      });

      if (existing.length > 0) {
        await this.prisma.tasksByUser.updateMany({
          where: { user: userId, uidTask: task.uid, type },
          data: {
            lastUpdate: new Date(),
            point: { increment: 1 },
          },
        });
      } else {
        await this.prisma.tasksByUser.create({
          data: {
            user: userId,
            uidTask: task.uid,
            type,
            point: 1,
            lastUpdate: new Date(),
          },
        });
      }
    }
  }

  // =========================
  // UPDATE / DELETE
  // =========================

  async updateImage(id: string, body: any) {
    return this.prisma.image.update({
      where: { uid: id },
      data: body,
    });
  }

  async deleteImage(id: string) {
    return this.prisma.image.update({
      where: { uid: id },
      data: { status: false },
    });
  }

  // =========================
  // SHUFFLE ESTABLE
  // =========================

  private seededShuffle<T>(array: T[], seed: number): T[] {
    const result = [...array];

    let random = seed;
    function rand() {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }
}