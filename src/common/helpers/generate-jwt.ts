import jwt from 'jsonwebtoken';
import { PrismaService } from '../../database/prisma.service';

interface JwtPayload {
  uid: string;
}

export const generateJwt = async (uid: string): Promise<string> => {
  if (!process.env.SECRETORPRIVATEKEY) {
    throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
  }

  const payload: JwtPayload = { uid };

  return jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
    expiresIn: '7d',
  });
};


export const verifyToken = async (token: string, prisma: PrismaService) => {
  if (!token || token.length < 10) return null;

  if (!process.env.SECRETORPRIVATEKEY) {
    throw new Error('No se encontró SECRETORPRIVATEKEY en el archivo .env');
  }

  const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY) as JwtPayload;

  const usuario = await prisma.user.findUnique({
    where: { uid: decoded.uid },
  });

  return usuario;
};