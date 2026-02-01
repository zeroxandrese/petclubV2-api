import { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import { DateFormatter, getLogoByEmpresa } from 'src/helpers';

interface CertificateEmployeeProps {
    ApellidosNombres: string;
    Dni: string;
    Cargo: string;
    Empresa: string;
    IngresoGestion: string;
    Turno: string;
};

const style: StyleDictionary = {
  header: {
    fontSize: 22,
    bold: true,
    alignment: 'center',
    margin: [ 0, 50, 0, 0 ]
  },
    body: {
    fontSize: 12,
    alignment: 'justify',
    margin: [0, 5, 0, 10],
  },
  signature:{
    fontSize: 13,
    bold: true
  },
  footer:{
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [ 0, 0, 0, 20 ]
  }
};

export const getCertificateEmployee = ( props: CertificateEmployeeProps ): TDocumentDefinitions =>{

    const { ApellidosNombres, Dni, Cargo, Empresa, IngresoGestion, Turno } = props;

    const logo = getLogoByEmpresa(Empresa);

    const docDefinition: TDocumentDefinitions = {
      styles: style,
      pageMargins: [40, 60, 40, 60],

      header: {
        columns: [ getLogoByEmpresa(Empresa),
          {
          text: DateFormatter.formatterDay(new Date()),
          alignment: 'right',
          margin: [ 20, 20 ]
        }
         ],
      },
      footer: {
        text: 'Esta constancia se expide a solicitud del interesado para los fines que considere conveniente.',
        style: 'footer'
      },
      content: [
        {
        text: `CONSTANCIA DE EMPLEO\n\n`,
        style: 'header'
        },
        {
          text: `Yo, COMITIVOS EVELYN, en mi calidad de Gerente de ${Empresa}, 
          por medio de la presente certifico que ${ApellidosNombres} ha sido empleado en nuestra empresa desde el ${IngresoGestion}.\n`,
          style: 'body'
        },
        {
          text: `Durante su empleo, el Sr./Sra. ${ApellidosNombres} 
          ha desempeñado el cargo de ${Cargo}, demostrando responsabilidad, compromiso y habilidades profesionales en sus 
          labores.\n`,
          style: 'body'
        },
        {
          text: `La jornada laboral del Sr./ Sra. ${ApellidosNombres} es de ${Turno}, cumpliendo con las políticas y procedimientos establecidos por la empresa.\n\n\n\n`,
          style: 'body'
        },
        {
          text: `Atentamente.\n COMITIVOS EVELYN.\n ${Empresa}.\n ${DateFormatter.formatterDay(new Date())}`,
          style: 'signature'
        }
      ],
    };

    return docDefinition

}