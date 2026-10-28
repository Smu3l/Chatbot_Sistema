// src/whatsapp/whatsapp.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ChatbotService } from '../chatbot/chatbot.service.js';

/**
 * Servicio encargado de la integración con WhatsApp Cloud API (Meta)
 * Implementa lógica 24/7: el bot siempre responde como primera línea de defensa
 */
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly whatsappApiUrl: string;
  private readonly whatsappApiToken: string;
  private readonly phoneNumberId: string;

  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly configService: ConfigService,
  ) {
    // Configuración de WhatsApp Cloud API
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || 'TU_PHONE_NUMBER_ID';
    this.whatsappApiToken = this.configService.get<string>('WHATSAPP_API_TOKEN') || '';
    this.whatsappApiUrl = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
  }

  /**
   * Envía un mensaje de texto a través de WhatsApp Cloud API
   * @param phone - Número telefónico del destinatario (formato internacional sin +)
   * @param text - Texto del mensaje a enviar
   * @returns Respuesta de la API de Meta
   */
  async sendMessage(phone: string, text: string): Promise<any> {
    try {
      // Limpiar número telefónico (remover + y espacios)
      const cleanPhone = phone.replace(/\+/g, '').replace(/\s/g, '');

      // Payload para WhatsApp Cloud API
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: text,
        },
      };

      // Headers con autorización Bearer
      const headers = {
        Authorization: `Bearer ${this.whatsappApiToken}`,
        'Content-Type': 'application/json',
      };

      this.logger.log(`Enviando mensaje a ${cleanPhone} via WhatsApp Cloud API`);

      // Enviar petición POST a Meta
      const response = await axios.post(this.whatsappApiUrl, payload, { headers });

      this.logger.log(`Mensaje enviado exitosamente a ${cleanPhone}`);
      return response.data;
    } catch (error) {
      const err: any = error;
      this.logger.error(
        `Error al enviar mensaje a ${phone}: ${err.response?.data?.error?.message || err.message}`,
      );
      // No lanzar error para evitar interrumpir el flujo 24/7 del bot
      return null;
    }
  }

  /**
   * Procesa un mensaje entrante de WhatsApp
   * El bot siempre responde 24/7 como primera línea de defensa
   * @param phoneNumber - Número telefónico del cliente
   * @param messageText - Texto del mensaje recibido
   */
  async handleIncomingMessage(phoneNumber: string, messageText: string): Promise<void> {
    try {
      this.logger.log(`Mensaje recibido de ${phoneNumber}: ${messageText}`);

      // Procesar mensaje con ChatbotService
      // El bot evalúa estado, horario y genera respuesta 24/7
      const botResponse = await this.chatbotService.processMessage(
        phoneNumber,
        messageText,
      );

      // Si el bot debe silenciarse (waiting_for_agent o human_mode)
      if (botResponse === null) {
        this.logger.log(
          `Bot silenciado para ${phoneNumber} - En modo agente humano o esperando atención`,
        );
        return;
      }

      // Enviar respuesta del bot a través de WhatsApp Cloud API
      if (botResponse && botResponse.trim() !== '') {
        await this.sendMessage(phoneNumber, botResponse);
      }
    } catch (error) {
      const err: any = error;
      this.logger.error(
        `Error al procesar mensaje entrante de ${phoneNumber}: ${err.message}`,
      );
      // En caso de error, el bot sigue funcionando 24/7 con mensaje genérico
      try {
        await this.sendMessage(
          phoneNumber,
          'Lo sentimos, ha ocurrido un error. Por favor, intenta nuevamente en un momento.',
        );
      } catch (sendError: any) {
        this.logger.error(`Error al enviar mensaje de error: ${sendError.message}`);
      }
    }
  }

  /**
   * Valida el token de verificación del webhook de Meta
   * @param verifyToken - Token enviado por Meta
   * @returns true si el token es válido
   */
  validateVerifyToken(verifyToken: string): boolean {
    const expectedToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN') || '';
    return verifyToken === expectedToken;
  }
}
