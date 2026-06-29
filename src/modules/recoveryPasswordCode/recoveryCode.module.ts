import { Module } from '@nestjs/common';
import { RecoveryController } from './recovery.controller';
import { RecoveryService } from '../recoveryPassword/recovery.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [RecoveryController],
  providers: [RecoveryService, PrismaService],
})
export class RecoveryCodeModule {}