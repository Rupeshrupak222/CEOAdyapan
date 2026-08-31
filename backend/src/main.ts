import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('AdyapanNexusGateway');
  const app = await NestFactory.create(AppModule);

  // Global Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile, etc.) or mirror origin
      if (!origin) return callback(null, true);
      
      const allowedPatterns = [
        'ceo-adyapan.vercel.app',
        'vercel.app',
        'adyapan.io',
        'adyapan.com',
        'localhost',
        '127.0.0.1',
      ];

      const isAllowed = allowedPatterns.some(pattern => origin.includes(pattern));

      if (isAllowed) {
        callback(null, true);
      } else {
        // Fallback: reflect request origin to prevent browser CORS block
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie', 'Authorization'],
  });

  // Global Request Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global Exception & Response Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 5000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(` 🏛️  ADYAPAN NEXUS ENTERPRISE BACKEND GATEWAY LIVE      `);
  logger.log(` 🌐  Server running on: http://localhost:${port}        `);
  logger.log(` ⚡  Unified Dashboard: http://localhost:${port}/api/dashboard/overview`);
  logger.log(` 🩺  Health Monitor:   http://localhost:${port}/api/health`);
  logger.log(`=======================================================`);
}

bootstrap();
