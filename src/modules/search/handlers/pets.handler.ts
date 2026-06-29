import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PetsHandler {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async search(term: string) {
        const mongoID = /^[0-9a-fA-F-]{36}$/.test(term);

        if (mongoID) {
            const pet = await this.prisma.pet.findUnique({
                where: { uid: term },
            });

            return pet ? [pet] : [];
        }

        return await this.prisma.pet.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { nombre: { contains: term, mode: 'insensitive' } },
                            { tipo: { contains: term, mode: 'insensitive' } },
                        ],
                    },
                    { status: true },
                ],
            },
        });
    }
}