import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('tbPaySlip')
export class Payslip {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  Ciclo: string;

  @Column({ type: 'nvarchar', length: 80, nullable: true })
  Documento: string;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  ApellidosNombres: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  Situacion: string;

  @Column({ type: 'date', nullable: true })
  FechaIngreso: Date;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  TipoTrabajador: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  RegimenPensionario: string;

  @Column({ type: 'nvarchar', length: 80, nullable: true })
  CUSPP: string;

  @Column({ type: 'int', nullable: true })
  DiasLaborados: number;

  @Column({ type: 'int', nullable: true })
  DiasNoLaborados: number;

  @Column({ type: 'int', nullable: true })
  DiasSubsidiados: number;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  Condicion: string;

  @Column({ type: 'int', nullable: true })
  JOTotalHoras: number;

  @Column({ type: 'int', nullable: true })
  JOMinutos: number;

  @Column({ type: 'int', nullable: true })
  STTotalHoras: number;

  @Column({ type: 'int', nullable: true })
  STMinutos: number;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  MSLTipo: string;

  @Column({ type: 'nvarchar', length: 250, nullable: true })
  MSLMotivo: string;

  @Column({ type: 'int', nullable: true })
  MSLDias: number;

  @Column({ type: 'nvarchar', length: 250, nullable: true })
  OtrosEmpleadoresRenta5taCategoria: string;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  ComisionesODestajos: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  VacacionesTruncas: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  RemuneracionBasica: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  BonifExtraProp2935130334: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  GratificacionProp2935130334: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  Tardanzas: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  ComisionAFPPorcentual: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  RentaQuintaCategoriaRetenciones: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  PrimaSeguroAFP: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  SPPAportacionObligatoria: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  PolizaSeguroDLEG688: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  ESSALUDTrab: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  RemuneracionMes: number;

  @Column({ type: 'decimal', precision: 13, scale: 2, nullable: true })
  NetoaPagar: number;

  @Column({ type: 'datetime', nullable: true })
  TimeStamp: Date;

  @Column({ type: 'nvarchar', length: 250, nullable: true })
  Cargo: string;

  @Column({ type: 'nvarchar', length: 250, nullable: true })
  Empresa: string;
}