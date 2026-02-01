import { Content } from 'pdfmake/interfaces';

export const getDocumentType = (documento: string): Content =>
  documento.trim().length === 9 ? 'CE' : 'DNI';