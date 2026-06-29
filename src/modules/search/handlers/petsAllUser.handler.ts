import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PetsAllUserHandler {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async search(term: string) {
        return await this.prisma.pet.findMany({
            where: {
                AND: [{ user: term }, { status: true }],
            },
        });
    }
}