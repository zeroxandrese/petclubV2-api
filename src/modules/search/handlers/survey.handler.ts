import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SurveyHandler {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const survey = await this.prisma.initialSurvey.findMany({
      where: { user: term },
    });

    return {
      survey,
    };
  }
}