// src/modules/tasks/tasks.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const tasks = await this.prisma.tasks.findMany({
        where: {
          status: true,
        },
      });

      return {
        results: tasks,
      };
    } catch (error) {
      console.error('Error en búsqueda de tasks:', error);
      throw new InternalServerErrorException(
        'Error en la búsqueda de tasks, contacta al administrador',
      );
    }
  }
}