// src/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { workcertificatesService } from './workcertificates.service';
import { workcertificatesController } from './workcertificates.controller';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  imports: [DatabaseModule, PrinterModule],
  providers: [workcertificatesService],
  controllers: [workcertificatesController],
})
export class workcertificatesModule {}