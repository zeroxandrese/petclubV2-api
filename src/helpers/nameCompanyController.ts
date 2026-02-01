import { Content } from 'pdfmake/interfaces';

export const getFullNameCompany = (empresa: string): Content => {
  const value = empresa.trim().toUpperCase();

  if (value.includes('MFM')) {
    return 'MFM TECHNOLOGIES PERU S.A.C.';
  }

  if (value.includes('BEPYC')) {
    return 'BEPYC DEL PERU SOCIEDAD ANONIMA CERRADA.';
  }

  if (value.includes('UNIMARK')) {
    return 'UNION DE NEGOCIOS INTERNACIONALES MARKOVIC S.A.C. - UNIMARKOVIC S.A.C.';
  }

  return 'MFM TECHNOLOGIES PERU S.A.C.';
};