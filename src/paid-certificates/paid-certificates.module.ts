import { Module } from '@nestjs/common';
import { PaidCertificatesService } from './paid-certificates.service';
import { PaidCertificatesController } from './paid-certificates.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PrinterModule],
  controllers: [PaidCertificatesController],
  providers: [PaidCertificatesService],
})
export class PaidCertificatesModule {}
