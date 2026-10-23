// src/prisma/prisma.module.ts

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

/**
 * Módulo global de Prisma.
 * Al ser @Global(), PrismaService estará disponible en toda la aplicación
 * sin necesidad de importar PrismaModule en cada módulo.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
