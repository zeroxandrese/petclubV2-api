import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class EmailHandler {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async search(term: string) {
        return await this.prisma.user.findFirst({
            where: {
                AND: [{ email: term }, { status: true }],
            },
        });
    }
}