// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio encargado de gestionar la conexión con Prisma ORM.
 * Extiende PrismaClient para exponer todos sus métodos.
 * Implementa OnModuleInit para conectar al iniciar la app
 * y OnModuleDestroy para desconectar al cerrar la app.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Conecta automáticamente con la base de datos al inicializar el módulo
   */
  async onModuleInit() {
    await this.$connect();
    console.log('[PrismaService] Conexión a PostgreSQL establecida correctamente.');
  }

  /**
   * Desconecta automáticamente de la base de datos al destruir el módulo
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[PrismaService] Conexión a PostgreSQL cerrada.');
  }

  /**
   * Método opcional para limpiar la base de datos en entornos de testing
   * (No ejecutar en producción)
   */
  async cleanDatabase() {
    // Deshabilitado por seguridad fuera de tests
    if (process.env.NODE_ENV !== 'test') return;

    // Orden inverso debido a relaciones (Quote depende de Client)
    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`);
        } catch (error) {
          console.error(`Error al limpiar la tabla ${tablename}:`, error);
        }
      }
    }
  }
}
