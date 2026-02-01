// src/pdf/pdf.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { PrinterService } from 'src/printer/printer.service';
import { getCertificateEmployee } from 'src/reports'

@Injectable()
export class workcertificatesService {
  constructor(
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly repo: Repository<Employee>,
    private readonly printerService: PrinterService
  ) { }

  async certificateForDni(dni: string) {
    const employee = await this.repo.findOne({ where: { Dni: dni } });

    if (!employee) {
      return;
    }

    const docDefinition = getCertificateEmployee({
      ApellidosNombres: employee.ApellidosNombres,
      Dni: employee.Dni,
      Cargo: employee.Cargo,
      Empresa: employee.Empresa,
      IngresoGestion: employee.IngresoGestion,
      Turno: employee.Turno,
    });

    const doc = this.printerService.createPdf(docDefinition);

    return doc;


  }
}