import { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import { DateFormatter, getFullNameCompany, getrucCompany, formatPeriodo, getDocumentType } from 'src/helpers';

export interface PayslipProps {
  // Empresa
  Empresa: string;

  // Trabajador
  ApellidosNombres: string;
  Documento: string;
  Cargo: string;
  Situacion: string;
  FechaIngreso: Date;

  // Periodo
  Periodo: string;

  // Datos laborales
  TipoTrabajador: string;
  RegimenPensionario: string;
  CUSPP: string;
  Condicion: string;

  // Días / jornadas
  DiasLaborados: number;
  DiasNoLaborados: number;
  DiasSubsidiados: number;

  JOTotalHoras: number;
  JOMinutos: number;
  STTotalHoras: number;
  STMinutos: number;

  // Suspensiones
  MSLTipo: string;
  MSLMotivo: string;
  MSLDias: number;

  // Ingresos
  RemuneracionBasica: number;
  ComisionesODestajos: number;
  VacacionesTruncas: number;
  BonificacionExtra: number;
  Gratificacion: number;
  RemuneracionMes: number;

  // Descuentos
  ComisionAFP: number;
  AFPObligatorio: number;
  SeguroAFP: number;
  RentaQuinta: number;
  Tardanzas: number;

  // Aportes empleador
  PolizaSeguro: number;
  Essalud: number;

  // Resultado
  NetoPagar: number;
}

const styles: StyleDictionary = {
  title: { fontSize: 20, bold: true, alignment: 'center', margin: [0, 20, 0, 15] },
  subtitle: { fontSize: 12, bold: true, margin: [0, 15, 0, 5] },
  text: { fontSize: 6, alignment: 'center', bold: true },
  textBody: { fontSize: 6 },
  tableHeader: { bold: true, fontSize: 10, fillColor: '#eeeeee' },
  total: { bold: true, fontSize: 10 },
  neto: { bold: true, fontSize: 14, color: '#ffffff' },
  footer: { fontSize: 9, italics: true, alignment: 'center', margin: [0, 20, 0, 0] },
};

export const getPayslipReport = (props: PayslipProps): TDocumentDefinitions => {
  const {
    Empresa,
    ApellidosNombres,
    Documento,
    Cargo,
    FechaIngreso,
    Periodo,
    RegimenPensionario,

    // INGRESOS
    RemuneracionBasica,
    ComisionesODestajos,
    VacacionesTruncas,
    Gratificacion,
    BonificacionExtra,

    // DESCUENTOS
    Tardanzas,
    ComisionAFP,
    SeguroAFP,
    AFPObligatorio,
    RentaQuinta,
    JOTotalHoras,

    // APORTES EMPLEADOR
    Essalud,
    CUSPP,
    // NETO
    NetoPagar
  } = props;

  return {
    styles,
    pageMargins: [40, 90, 40, 60],

    footer: {
      text: 'Documento generado electrónicamente – válido sin firma manuscrita.',
      style: 'footer',
    },

    content: [
      {
        stack: [
          {
            text: getFullNameCompany(Empresa),
            bold: true,
            fontSize: 11,
            margin: [0, 0, 0, 5]
          },
          {
            text: getrucCompany(Empresa),
            fontSize: 8,
            margin: [0, 0, 0, 10]
          }
        ]
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: `BOLETA DE PAGO`,
                style: 'text'
              }
            ],
            [
              {
                text: `D.S N°001-98-TR`,
                style: 'text'
              }
            ],
            [
              {
                text: `R.M N° 020-2008 TR`,
                style: 'text'
              }
            ],
            [
              {
                text: `${formatPeriodo(Periodo)}`,
                style: 'text'
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => 'black',
          vLineColor: () => 'black',
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 1,
          paddingBottom: () => 1,
        },
        margin: [0, 0, 0, 20]
      },

        //
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                text: 'Documento de Identidad',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              },
              {
                text: 'Nombre y Apellidos',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              },
              {
                text: 'Situación',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              }
            ],
            
            [
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        table: {
                          widths: ['49%', 1, '49%'],
                          body: [
                            [
                              {
                                text: 'Tipo',
                                alignment: 'center',
                                style: 'textBody',
                                fillColor: '#D0E4FF'
                              },
                              { text: '', fillColor: 'black' },
                              {
                                text: 'Número',
                                alignment: 'center',
                                style: 'textBody',
                                fillColor: '#D0E4FF'
                              }
                            ]
                          ]
                        },
                        layout: {
                          hLineWidth: () => 0,
                          vLineWidth: () => 0,
                          paddingLeft: () => 0,
                          paddingRight: () => 0,
                          paddingTop: () => 1,
                          paddingBottom: () => 1
                        }
                      }
                    ],
            
                    [
                      {
                        canvas: [
                          {
                            type: 'line',
                            x1: -20,
                            y1: 0,
                            x2: 151,
                            y2: 0,
                            lineWidth: 1
                          }
                        ],
                        margin: [15, 2, 15, 2]
                      }
                    ],
            
                    [
                      {
                        table: {
                          widths: ['49%', 1, '49%'],
                          body: [
                            [
                              { text: getDocumentType(Documento), alignment: 'center', style: 'textBody' },
                              { text: '', fillColor: 'black' },
                              { text: Documento, alignment: 'center', style: 'textBody' }
                            ]
                          ]
                        },
                        layout: {
                          hLineWidth: () => 0,
                          vLineWidth: () => 0,
                          paddingLeft: () => 0,
                          paddingRight: () => 0,
                          paddingTop: () => 1,
                          paddingBottom: () => 0
                        }
                      }
                    ]
                  ]
                },
                layout: {
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                  paddingLeft: () => 0,
                  paddingRight: () => 0,
                  paddingTop: () => 0,
                  paddingBottom: () => 0
                }
              },
            
              { text: ApellidosNombres, alignment: 'center', style: 'textBody', margin: [0, 8, 0, 0] },
              { text: 'ACTIVO O SUBSIDIADO', alignment: 'center', style: 'textBody', margin: [0, 8, 0, 0] }
            ]
            
          ]
        }
      },

      //
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {
                text: 'Fecha de Ingreso',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              },
              {
                text: 'Tipo de Trabajador',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              },
              {
                text: 'Regimen Pensionario',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              },
              {
                text: 'CUSPP',
                style: 'textBody',
                alignment: 'center',
                fillColor: '#D0E4FF'
              }
            ],
            
            [
              {
                text: `${FechaIngreso}`,
                style: 'textBody',
                alignment: 'center'
              },
              {
                text: 'EMPLEADO',
                style: 'textBody',
                alignment: 'center'
              },
              {
                text: `${RegimenPensionario}`,
                style: 'textBody',
                alignment: 'center'
              },
              {
                text: `${CUSPP}`,
                style: 'textBody',
                alignment: 'center'
              }
            ]
            ]
          }        
      },

        //
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [

            [
              { text: 'Días Laborados', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Días No Laborados', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Días subsidiados', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Condición', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Jornada Ordinaria', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Sobretiempo', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
            ],
      

            [
              { text: '31', style: 'textBody', alignment: 'center', margin: [0, 8, 0, 0] },
              { text: '0', style: 'textBody', alignment: 'center', margin: [0, 8, 0, 0] },
              { text: '0', style: 'textBody', alignment: 'center', margin: [0, 8, 0, 0] },
              { text: 'Domiciliado', style: 'textBody', alignment: 'center', margin: [0, 8, 0, 0] },
      
              {
                stack: [
                  {
                    table: {
                      widths: ['49%', 1, '49%'],
                      body: [[
                        { text: 'Total Horas', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', fillColor: '#000' },
                        { text: 'Minutos', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 2
                    }
                  },
              
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: -5,
                        y1: 0,
                        x2: 81,
                        y2: 0,
                        lineWidth: 1
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },
              
                  {
                    table: {
                      widths: ['49%', 1, '49%'],
                      body: [[
                        { text: JOTotalHoras, style: 'textBody', alignment: 'center' },
                        { text: '', fillColor: '#000' },
                        { text: '0', style: 'textBody', alignment: 'center' }
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 0
                    }
                  }
                ]
              },
      
              {
                stack: [
                  {
                    table: {
                      widths: ['49%', 1, '49%'],
                      body: [[
                        { text: 'Total Horas', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', fillColor: '#000' },
                        { text: 'Minutos', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 2
                    }
                  },
              
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: -5,
                        y1: 0,
                        x2: 81,
                        y2: 0,
                        lineWidth: 1
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },
              
                  {
                    table: {
                      widths: ['49%', 1, '49%'],
                      body: [[
                        { text: '0', style: 'textBody', alignment: 'center' },
                        { text: '', fillColor: '#000' },
                        { text: '0', style: 'textBody', alignment: 'center' }
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 0
                    }
                  }
                ]
              }


            ]
          ]
        }
      },

        //
      {
        table: {
          widths: ['70%', '30%'],
          body: [
            [
              { text: 'Motivo de Suspensión de Labores', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Otros empleadores por Rentas de 5ta categoría', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
            ],

            [

              {
                stack: [
                  {
                    table: {
                      widths: ['*', 1, '*', 1, '*'],
                      body: [[
                        { text: 'Tipo', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', fillColor: '#000' },
                        { text: 'Motivo', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', fillColor: '#000' },
                        { text: 'N.º Días', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 2
                    }
                  },
              
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: -5,
                        y1: 0,
                        x2: 355,
                        y2: 0,
                        lineWidth: 1
                      }
                    ],
                    margin: [0, 0, 0, 0]
                  },
              
                  {
                    table: {
                      widths: ['*', 1, '*', 1, '*'],
                      body: [[
                        { text: '0', style: 'textBody', alignment: 'center' },
                        { text: '', fillColor: '#000' },
                        { text: '0', style: 'textBody', alignment: 'center' },
                        { text: '', fillColor: '#000' },
                        { text: '0', style: 'textBody', alignment: 'center' },
                      ]]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 2,
                      paddingBottom: () => 0
                    }
                  }
                ]
              },
              { text: 'No tiene', style: 'textBody', alignment: 'center', margin: [0, 8, 0, 0] },

            ]

          ]
        },
      },

      //
      {
        margin: [0, 10, 0, 0],
        table: {
          widths: ['15%', '35%', '20%', '10%', '20%'],
          body: [
            [
              { text: 'Código', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Conceptos', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Ingresos S/.', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Descuentos S/', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
              { text: 'Neto S/.', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
            ]

          ]
        },
      },

      {
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                {
                  table: {
                    widths: ['15%', '35%', '20%', '10%', '20%'],
                    body: [
                      [
                        { text: 'Ingresos', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ],

                      [

                        { text: '0121', style: 'textBody', alignment: 'center' },
                        { text: 'REMUNERACIÓN O JORNAL BÁSICO', style: 'textBody'},
                        { text: RemuneracionBasica, style: 'textBody', alignment: 'center' },
                        { text: '', style: 'textBody' },
                        { text: '', style: 'textBody' }
      
                      ],
      
                      [
                        { text: 'Descuentos', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ],
      
                      [
                        { text: '0704', style: 'textBody', alignment: 'center' },
                        { text: 'TARDANZAS', style: 'textBody' },
                        { text: '', style: 'textBody', alignment: 'center' },
                        { text: Tardanzas, style: 'textBody', alignment: 'right' },
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],

                      [
                        { text: 'Aportes del Trabajador', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', alignment: 'center', fillColor: '#D0E4FF' }
                      ],
      
                      [
                        { text: '0601', style: 'textBody', alignment: 'center'},
                        { text: 'COMISIÓN AFP PORCENTUAL', style: 'textBody' },
                        { text: '', style: 'textBody', alignment: 'center' },
                        { text: '0', style: 'textBody', alignment: 'right'},
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],
      
                      [
                        { text: '0605', style: 'textBody', alignment: 'center' },
                        { text: 'RENTA QUINTA CATEGORÍA RETENCIONES', style: 'textBody' },
                        { text: '', style: 'textBody', alignment: 'center'},
                        { text: '0', style: 'textBody', alignment: 'right' },
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],
      
                      [
                        { text: '0606', style: 'textBody', alignment: 'center'},
                        { text: 'PRIMA DE SEGURO AFP', style: 'textBody'},
                        { text: '', style: 'textBody', alignment: 'center' },
                        { text: SeguroAFP, style: 'textBody', alignment: 'right' },
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],

                      [
                        { text: '0607', style: 'textBody', alignment: 'center' },
                        { text: 'SISTEMA NAC. DE PENSIONES DL 19990', style: 'textBody' },
                        { text: '', style: 'textBody', alignment: 'center'},
                        { text: '0', style: 'textBody', alignment: 'right' },
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],
      
                      [
                        { text: '0608', style: 'textBody', alignment: 'center' },
                        { text: 'SPP - APORTACIÓN OBLIGATORIA', style: 'textBody' },
                        { text: '', style: 'textBody', alignment: 'center' },
                        { text: AFPObligatorio, style: 'textBody', alignment: 'right' },
                        { text: '', style: 'textBody', alignment: 'center' }
                      ],

                      [
                        { text: 'Neto a Pagar', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: '', style: 'textBody', fillColor: '#D0E4FF' },
                        { text: NetoPagar, style: 'textBody', alignment: 'right', fillColor: '#D0E4FF' }
                      ]
                    ]
                  },
                  layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                    paddingLeft: () => 0,
                    paddingRight: () => 2,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                  }
                },
      
                // línea inferior
                {
                  canvas: [{
                    type: 'line',
                    x1: 0,
                    y1: 0,
                    x2: 515,
                    y2: 0,
                    lineWidth: 1
                  }]
                }
              ]
            }
          ]]
        },

        layout: {
          vLineWidth: (i) => (i === 0 || i === 1 ? 1 : 0),
          hLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0
        }
      },

      {
        margin: [0, 10, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [
              { text: 'Aportes de Empleador', style: 'textBody', fillColor: '#D0E4FF' },
            ]

          ]
        },
      },

      {
        table: {
          widths: ['*'],
          body: [[
            {
              stack: [
                {
                  table: {
                    widths: ['15%', '60%', '25%'],
                    body: [
                      [
                        { text: '0803', style: 'textBody', alignment: 'center'},
                        { text: 'PÓLIZA DE SEGURO - D. LEG. 688', style: 'textBody'},
                        { text: '14.75', style: 'textBody', alignment: 'right' }
                      ],

                      [

                        { text: '0804', style: 'textBody', alignment: 'center' },
                        { text: 'ESSALUD(REGULAR CBSSP AGRAR/AC)TRAB', style: 'textBody'},
                        { text: Essalud, style: 'textBody', alignment: 'right' }
      
                      ]
                    ]
                  },
                  layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                    paddingLeft: () => 0,
                    paddingRight: () => 0,
                    paddingTop: () => 2,
                    paddingBottom: () => 2
                  }
                },
      
              ]
            }
          ]]
        },

        layout: {
          vLineWidth: (i) => (i === 0 || i === 1 ? 1 : 0),
          hLineWidth: () => 0,
          paddingLeft: () => 2,
          paddingRight: () => 2,
          paddingTop: () => 0,
          paddingBottom: () => 0
        }
      },

      {
        margin: [0, 60, 0, 0],
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 220,
                        y2: 0,
                        lineWidth: 1
                      }
                    ],
                    margin: [0, 0, 0, 5]
                  },
                  {
                    text: 'Empleador',
                    fontSize: 7,
                    alignment: 'center',
                    color: '#555'
                  },
                  {
                    text: 'RECURSOS HUMANOS',
                    fontSize: 7,
                    alignment: 'center',
                    color: '#555'
                  }
                ]
              },
      
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 220,
                        y2: 0,
                        lineWidth: 1
                      }
                    ],
                    margin: [0, 0, 0, 5]
                  },
                  {
                    text: 'Nombres y Apellidos',
                    fontSize: 7,
                    alignment: 'center',
                    color: '#555'
                  },
                  {
                    text: ApellidosNombres,
                    style: 'textBody',
                    alignment: 'center'
                  }
                ]
              }
            ]
          ]
        },
      
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 0,
          paddingBottom: () => 0
        }
      }



     
    ]
  };
};