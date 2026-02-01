import { Content } from 'pdfmake/interfaces';

export const getrucCompany = (empresa: string): Content => {
  const value = empresa.trim().toUpperCase();

  if (value.includes('MFM')) {
    return '20612758205';
  }

  if (value.includes('BEPYC')) {
    return '20600908937';
  }

  if (value.includes('UNIMARK')) {
    return '20552640315';
  }

  return '20612758205';
};