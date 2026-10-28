// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { ScheduleModule } from './schedule/schedule.module.js';
import { ChatbotModule } from './chatbot/chatbot.module.js';
import { WhatsappModule } from './whatsapp/whatsapp.module.js';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Módulos de la aplicación
    PrismaModule,
    ClientsModule,
    ScheduleModule,
    ChatbotModule,
    WhatsappModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

