import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TasksByUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const tasksSon = await this.prisma.tasksByUser.findMany({
      where: { user: term },
    });

    const taskUids = tasksSon.map((task) => task.uidTask);

    const tasksFather = await this.prisma.tasks.findMany({
      where: {
        uid: { in: taskUids },
      },
    });

    const results = tasksFather.map((fatherTask) => {
      const taskSon = tasksSon.find(
        (task) => task.uidTask === fatherTask.uid,
      );

      const porc = taskSon
        ? (taskSon.point / fatherTask.target) * 100
        : 0;

      const float = taskSon
        ? taskSon.point / fatherTask.target
        : 0;

      return {
        uid: fatherTask.uid,
        subject: fatherTask.subject,
        description: fatherTask.description,
        reward: fatherTask.reward,
        status: fatherTask.status,
        created: fatherTask.created.toISOString(),
        porc: porc.toFixed(2),
        float: float.toFixed(3),
        type: fatherTask.type,
      };
    });

    return results;
  }
}