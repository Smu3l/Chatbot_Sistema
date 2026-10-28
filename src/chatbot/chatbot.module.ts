// src/chatbot/chatbot.module.ts

import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service.js';
import { ChatbotController } from './chatbot.controller.js';
import { ClientsModule } from '../clients/clients.module.js';
import { ScheduleModule } from '../schedule/schedule.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

/**
 * Módulo principal del chatbot
 * Encapsula toda la lógica conversacional del bot
 */
@Module({
  imports: [ClientsModule, ScheduleModule, PrismaModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
