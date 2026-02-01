import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { workcertificatesModule } from './workcertificates/workcertificates.module';
import { PrinterModule } from './printer/printer.module';
import { PaidCertificatesModule } from './paid-certificates/paid-certificates.module';

@Module({
  imports: [
    DatabaseModule,
    workcertificatesModule,
    PrinterModule,
    PaidCertificatesModule,
  ],
})
export class AppModule {}
