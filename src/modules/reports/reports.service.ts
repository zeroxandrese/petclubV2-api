import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(reporterId: string, reportedUserId: string, dto: CreateReportDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { uid: reportedUserId }
      });
      if (!userExists) throw new NotFoundException('El usuario a reportar no existe');

      await this.prisma.report.create({
        data: {
          user: reporterId,
          userReported: reportedUserId,
          note: dto.note,
        },
      });

      return {
        msg: 'Reporte enviado de manera satisfactoria',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error creando el reporte:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async deleteReport(reportId: string) {
    try {
      const report = await this.prisma.report.update({
        where: { uid: reportId },
        data: { status: false },
      });

      return { report };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('El reporte no existe');
      }
      throw new InternalServerErrorException('Error al eliminar el reporte');
    }
  }
}