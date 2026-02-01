import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { workcertificatesService } from './workcertificates.service';
import type { Response } from 'express';
import * as crypto from 'crypto';

@Controller('workcertificates')
export class workcertificatesController {
  constructor(private readonly service: workcertificatesService) {}

  @Get()
  async getCertificateEmployee(
    @Query('token') token: string,
    @Res() response: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [dni, exp, signature] = decoded.split('|');

    if (!dni || !exp || !signature) {
      throw new UnauthorizedException('Token inválido');
    }

    if (Date.now() / 1000 > Number(exp)) {
      throw new UnauthorizedException('Token expirado');
    }

    const secret = process.env.CERT_SECRET!;
    const payload = `${dni}|${exp}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Token alterado');
    }

    const certificate = await this.service.certificateForDni(dni);
    if (!certificate) {
      throw new UnauthorizedException('Empleado no encontrado');
    }

    response.setHeader('Content-Type', 'application/pdf');
    certificate.info.Title = 'employeeCertificate';
    certificate.pipe(response);
    certificate.end();
  }
}