import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PetsImgHandler {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async search(term: string) {
        return await this.prisma.image.findMany({
            where: {
                AND: [{ pet: term }, { status: true }],
            },
        });
    }
}