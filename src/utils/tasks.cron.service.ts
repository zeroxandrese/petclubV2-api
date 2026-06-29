import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service'; // Ajusta la ruta

@Injectable()
export class TasksCronService {
  private readonly logger = new Logger(TasksCronService.name);

  constructor(private prisma: PrismaService) {}

  // ==========================================
  // Limpieza Diaria de Notificaciones
  // Medianoche (0 0 * * *)
  // ==========================================
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanNotifications() {
    this.logger.log('Iniciando limpieza de notificaciones...');
    try {
      const uniqueUsers = await this.prisma.notifications.findMany({
        distinct: ['userOwner'],
        select: { userOwner: true },
      });

      const uidsToDelete: string[] = [];

      for (const { userOwner } of uniqueUsers) {
        const userNotifications = await this.prisma.notifications.findMany({
          where: { userOwner },
          orderBy: { charged: 'desc' },
          select: { uid: true },
        });

        if (userNotifications.length > 15) {
          const excess = userNotifications.slice(15).map(n => n.uid);
          uidsToDelete.push(...excess);
        }
      }

      if (uidsToDelete.length > 0) {
        const result = await this.prisma.notifications.deleteMany({
          where: {
            uid: { in: uidsToDelete },
          },
        });
        this.logger.log(`Limpieza completada. Se eliminaron ${result.count} notificaciones obsoletas.`);
      } else {
        this.logger.log('No se encontraron notificaciones que excedieran el límite permitido.');
      }
    } catch (error) {
      this.logger.error('Error al ejecutar la tarea de limpieza de notificaciones:', error);
    }
  }

  // ==========================================
  // Actualización de Ranking de Paws
  // 00:00, 07:00, 14:00 y 21:00 horas
  // ==========================================
  @Cron('0 0,7,14,21 * * *')
  async handleTruncateRanking() {
    this.logger.log('Iniciando proceso de actualización del ranking diario...');
    try {
      const pawsCounts = await this.prisma.pawsCount.findMany({
        where: { status: true },
        orderBy: { paws: 'desc' },
      });

      await this.prisma.ranking.deleteMany({
        where: { status: true },
      });

      const rankingRecords = pawsCounts.map((pawsCount, index) => ({
        user: pawsCount.user,
        position: index + 1,
        status: true,
        created: new Date(),
      }));

      if (rankingRecords.length > 0) {
        await this.prisma.ranking.createMany({
          data: rankingRecords,
        });
        this.logger.log(`Ranking actualizado exitosamente con ${rankingRecords.length} participantes.`);
      }
    } catch (error) {
      this.logger.error('Error en el proceso de actualización del ranking:', error);
    }
  }

  // ==========================================
  // Expiración de Códigos de Recuperación
  // Cada 2 horas (0 */2 * * *)
  // ==========================================
  @Cron('0 */2 * * *')
  async handleCleanPasswordCode() {
    this.logger.log('Iniciando expiración de códigos de recuperación de contraseña...');
    try {
      const cutoffTime = new Date(Date.now() - 4 * 60 * 1000);

      const updatedRecords = await this.prisma.recoveryPassword.updateMany({
        where: {
          status: true,
          charged: { lte: cutoffTime },
        },
        data: {
          status: false,
        },
      });

      this.logger.log(`Expiración finalizada. Se invalidaron ${updatedRecords.count} códigos antiguos.`);
    } catch (error) {
      this.logger.error('Error al actualizar registros de recuperación:', error);
    }
  }
}