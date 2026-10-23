// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend/chatbot
  app.enableCors({
    origin: '*', // En producción reemplazar por dominios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Habilitar validación global con class-validator/class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      // Elimina propiedades no definidas en el DTO
      whitelist: true,
      // Lanza error si se envían propiedades no permitidas
      forbidNonWhitelisted: true,
      // Transforma los payloads a instancias de DTO automáticamente
      transform: true,
      // Transforma tipos primitivos (ej. query params) según el DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
  console.log(`📦 Módulo REST: http://localhost:${port}/clients`);
}
await bootstrap();

