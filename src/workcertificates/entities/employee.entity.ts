import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbDataRHHEmpleadosGeneral')
export class Employee {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Dni: string;

  @Column()
  ApellidosNombres: string;

  @Column()
  Cargo: string;

  @Column()
  Empresa: string;

  @Column()
  IngresoGestion: string;

  @Column()
  Turno: string;

  @Column()
  Estado: string;
}