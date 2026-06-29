import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ImagesHandler {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async search(term: string) {
        return await this.prisma.image.findMany({
            where: {
                AND: [{ user: term }, { status: true }],
            },
        });
    }
}