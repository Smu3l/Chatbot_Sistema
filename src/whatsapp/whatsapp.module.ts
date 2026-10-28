// src/whatsapp/whatsapp.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service.js';
import { WhatsappController } from './whatsapp.controller.js';
import { ChatbotModule } from '../chatbot/chatbot.module.js';

/**
 * Módulo de integración con WhatsApp Cloud API
 * Proporciona webhook para recibir mensajes y enviar respuestas 24/7
 */
@Module({
  imports: [ConfigModule, ChatbotModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
