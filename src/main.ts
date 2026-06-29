import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(
    '/api',
    rateLimit({
      max: 350,
      windowMs: 2 * 60 * 1000,
      message: 'Has superado la cantidad de solicitudes permitidas',
    }),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}

bootstrap();