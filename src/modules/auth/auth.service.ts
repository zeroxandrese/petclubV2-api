import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.status || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ uid: user.uid });

    const { password: _, ...userSafe } = user;

    return {
      user: userSafe,
      token,
    };
  }

  async googleLogin(googleToken: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new BadRequestException('Token Google inválido');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          nombre: payload.name || 'Google User',
          img: payload.picture,
          google: true,
          status: true,
        },
      });
    }

    const token = this.jwtService.sign({ uid: user.uid });

    const { password, ...safe } = user;

    return {
      user: safe,
      token,
    };
  }

  async verify(uid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });

    if (!user) throw new UnauthorizedException();

    const { password, ...safe } = user;
    return safe;
  }
}