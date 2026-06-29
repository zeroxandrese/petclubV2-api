import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { verifyToken } from '../helpers/generate-jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'] as string;
    const zToken = req.headers['z-token'] as string;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Formato estándar: "Bearer <token>"
      token = authHeader.split(' ')[1];
    } else if (zToken) {
      // Formato legacy: "<token>"
      token = zToken;
    }

    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

    try {
      const user = await verifyToken(token, this.prisma);

      if (!user || !user.status) {
        throw new UnauthorizedException('Token inválido o usuario inactivo');
      }

      req.userAuth = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }
}