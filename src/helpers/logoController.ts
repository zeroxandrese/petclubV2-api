import { Content } from 'pdfmake/interfaces';

const logoMFM: Content = {
  image:'src/assets/logoMFM.png',
  width: 100,
  height: 80,
  margin: [8, 8, 0, 20]
};

const logoBEPIC: Content = {
  image:'src/assets/LogoBEPIC.png',
  width: 100,
  height: 80,
  margin: [8, 8, 0, 20]
};

const logoALLMARK: Content = {
  image:'src/assets/logoALLMARK.png',
  width: 100,
  height: 70,
  margin: [8, 8, 0, 20]
};

export const getLogoByEmpresa = (empresa: string): Content => {
  const value = empresa.trim().toUpperCase();

  if (value.includes('MFM')) {
    return logoMFM;
  }

  if (value.includes('BEPYC')) {
    return logoBEPIC;
  }

  if (value.includes('UNIMARK')) {
    return logoALLMARK;
  }

  return logoMFM;
};