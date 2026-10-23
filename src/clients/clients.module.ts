// src/clients/clients.module.ts

import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service.js';
import { ClientsController } from './clients.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

/**
 * Módulo de Clientes
 * Encapsula toda la funcionalidad relacionada con la gestión de usuarios/clientes
 */
@Module({
  imports: [PrismaModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  // Exportamos el servicio para poder ser usado por otros módulos (ej. QuotesModule)
  exports: [ClientsService],
})
export class ClientsModule {}
