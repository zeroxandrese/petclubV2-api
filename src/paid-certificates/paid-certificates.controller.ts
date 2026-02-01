import {
  Controller,
  Get,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { PaidCertificatesService } from './paid-certificates.service';
import type { Response } from 'express';
import * as crypto from 'crypto';

@Controller('paidcertificates')
export class PaidCertificatesController {
  constructor(private readonly service: PaidCertificatesService) {}

  @Get()
  async getPaidCertificate(
    @Query('token') token: string,
    @Res() response: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [dni, ciclo, exp, signature] = decoded.split('|');

    if (!dni || !exp || !ciclo || !signature) {
      throw new UnauthorizedException('Token inválido');
    }

    if (Date.now() / 100000 > Number(exp)) {
      throw new UnauthorizedException('Token expirado');
    }

    const secret = process.env.CERT_SECRET!;
    const payload = `${dni}|${ciclo}|${exp}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Token alterado');
    }

    const certificate = await this.service.certificateSalesForDni(dni, ciclo);
    if (!certificate) {
      throw new UnauthorizedException('Empleado no encontrado');
    }

    response.setHeader('Content-Type', 'application/pdf');
    certificate.info.Title = 'CertificadoDePago';
    certificate.pipe(response);
    certificate.end();
  }
}