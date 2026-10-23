var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
let PrismaService = class PrismaService extends PrismaClient {
    async onModuleInit() {
        await this.$connect();
        console.log('[PrismaService] Conexión a PostgreSQL establecida correctamente.');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('[PrismaService] Conexión a PostgreSQL cerrada.');
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV !== 'test')
            return;
        const tablenames = await this.$queryRaw `SELECT tablename FROM pg_tables WHERE schemaname='public'`;
        for (const { tablename } of tablenames) {
            if (tablename !== '_prisma_migrations') {
                try {
                    await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`);
                }
                catch (error) {
                    console.error(`Error al limpiar la tabla ${tablename}:`, error);
                }
            }
        }
    }
};
PrismaService = __decorate([
    Injectable()
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map