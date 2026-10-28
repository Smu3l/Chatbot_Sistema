// src/chatbot/chatbot.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatbotService } from './chatbot.service.js';

/**
 * DTO para la prueba del chatbot
 */
class TestChatDto {
  phone: string;
  message: string;
}

/**
 * Controlador temporal para probar la lógica del chatbot
 * Ruta base: /chat
 */
@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST /chat/test
   * Endpoint de prueba para simular mensajes del chatbot
   * @param body - Objeto con phone y message
   * @returns Respuesta del bot o null si debe silenciarse
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testChat(@Body() body: TestChatDto) {
    const { phone, message } = body;

    // Procesar mensaje a través del motor del chatbot
    const response = await this.chatbotService.processMessage(phone, message);

    return {
      success: true,
      input: {
        phone,
        message,
      },
      botResponse: response,
      isBotSilent: response === null,
    };
  }
}
