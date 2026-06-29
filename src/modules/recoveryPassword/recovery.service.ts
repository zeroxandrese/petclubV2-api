import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Resend } from 'resend';
import MersenneTwister from 'mersenne-twister';
import { generateJwt } from '../../common/helpers/generate-jwt';

@Injectable()
export class RecoveryService {
    private resend: Resend;
    private generator: MersenneTwister;

    constructor(private prisma: PrismaService) {
        this.resend = new Resend(process.env.RESENDKEY);
        this.generator = new MersenneTwister();
    }

    async requestCode(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new BadRequestException('Email no registrado');

        const repeat = await this.prisma.recoveryPassword.findFirst({
            where: { user: user.uid, status: true }
        });
        if (repeat) throw new BadRequestException('El usuario tiene un código activo');

        const { nombre } = user;
        const code = Math.floor(this.generator.random() * 9000) + 1000;

        await this.prisma.recoveryPassword.create({
            data: { user: user.uid, code }
        });

        await resend.emails.send({
            from: "petClub <admin@petclub.com.pe>",
            to: `${email}`,
            reply_to: "contacto@petclub.com.pe",
            subject: "Recupera tu clave de acceso en petClub",
            html: `    <html>
            <head>
                <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
        
                .container {
                    background: linear-gradient(135deg, #4CC9F0 0%, #7209B7 100%);
                    padding: 90px 35%; /* Relleno vertical y relleno horizontal */
                }
        
                .content {
                    background: #FFFFFF;
                    padding: 20px;
                }
        
                .code {
                    font-size: 26px;
                    letter-spacing: 4px;
                    text-align: center;
                }
        
                @media screen and (max-width: 600px) {
                    .container {
                        background: linear-gradient(135deg, #4CC9F0 0%, #7209B7 100%);
                        padding: 50px 5%;
                    }
        
                    .code {
                        font-size: 20px;
                        text-align: center
                    }
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <p>Hola ${nombre}.</p>
                        <p>Código de Verificación para Recuperar Contraseña en petClub:</p>
                        <p class="code"><strong>${code}</strong></p>
                        <p>¡Gracias por ser parte de petClub, la comunidad de amantes de las mascotas!</p>
                        <p>NOVAMATRIX | Lima - Perú</p>
                    </div>
                </div>
            </body>
            </html>`,
        });

        return { msg: 'Código enviado' };
    }

    async verifyCode(email: string, code: number) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Error con el usuario');

        const resp = await this.prisma.recoveryPassword.findFirst({
            where: { user: user.uid, status: true, code }
        });

        if (!resp) throw new UnauthorizedException('Código no autorizado');

        const token = await generateJwt(user.uid);
        return { uid: user.uid, msg: 'Código autorizado', token };
    }
}