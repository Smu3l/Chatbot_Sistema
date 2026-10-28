// src/chatbot/chatbot.service.ts

import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service.js';
import { ScheduleService } from '../schedule/schedule.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Client } from '@prisma/client';

/**
 * Servicio principal que contiene la lógica del motor del chatbot
 * Coordina la disponibilidad de asesores, el estado de conversación y la generación de cotizaciones
 */
@Injectable()
export class ChatbotService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly scheduleService: ScheduleService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Procesa un mensaje entrante del usuario
   * Gestiona el flujo conversacional basado en el estado del cliente
   * @param phone_number - Número telefónico del cliente
   * @param incoming_text - Texto del mensaje recibido
   * @returns Mensaje a responder por el bot, o null si el bot debe silenciarse
   */
  async processMessage(
    phone_number: string,
    incoming_text: string,
  ): Promise<string | null> {
    // 1. Buscar al cliente por teléfono, o crearlo con estado idle si no existe
    let client: Client;
    
    try {
      // Intentar buscar el cliente existente
      client = await this.clientsService.findByPhone(phone_number);
    } catch (error) {
      // Si no existe, crear un nuevo cliente con estado idle
      client = await this.clientsService.create({
        phone_number,
        name: undefined,
        chat_state: 'idle',
      });
    }

    // 2. Verificar disponibilidad de asesores
    const isAgentAvailable = this.scheduleService.isAgentAvailable();

    // Si no hay agentes disponibles, generar mensaje de fuera de horario
    // pero continuar con el flujo normal del bot
    if (!isAgentAvailable) {
      // Nota: El mensaje de fuera de horario se agregará al flujo según corresponda
      // pero el bot continúa procesando según el estado del cliente
      console.log(
        `[ChatbotService] Fuera de horario para cliente ${phone_number}. Estado actual: ${client.chat_state}`,
      );
    }

    // 3. Usar switch basado en el estado del cliente
    switch (client.chat_state) {
      case 'idle': {
        // Retornar mensaje de bienvenida con catálogo (ARL, Salud, Pensión)
        // y actualizar el estado a choosing_service
        const welcomeMessage = `¡Bienvenido/a! 👋\n\nSoy tu asistente virtual. Te ayudo a cotizar nuestros servicios.\n\n📋 **CATÁLOGO DE SERVICIOS:**\n\n• **ARL** - Administración de Riesgos Laborales\n• **Salud** - Planes de salud y medicina prepagada\n• **Pensión** - Asesoría y gestión de pensiones\n\n${!isAgentAvailable ? '⚠️ *Actualmente estamos fuera de horario de atención. Un asesor te contactará cuando retomemos la atención.*\n\n' : ''}¿Qué servicio te interesa cotizar? Por favor, indícame escribiendo: ARL, Salud o Pensión.`;

        // Actualizar el estado del cliente a choosing_service
        await this.clientsService.update(client.id, {
          chat_state: 'choosing_service',
        });

        return welcomeMessage;
      }

      case 'choosing_service': {
        // Crear una cotización ficticia basada en el texto del usuario
        const serviceType = this.normalizeServiceType(incoming_text);
        
        // Generar precio estimado ficticio según el tipo de servicio
        const estimatedPrice = this.getEstimatedPrice(serviceType);

        // Crear cotización en la base de datos
        await this.prisma.quote.create({
          data: {
            client_id: client.id,
            service_type: serviceType,
            estimated_price: estimatedPrice,
            status: 'pending',
          },
        });

        // Actualizar el estado del cliente a waiting_for_agent
        await this.clientsService.update(client.id, {
          chat_state: 'waiting_for_agent',
        });

        // Retornar mensaje de despedida del bot
        const farewellMessage = `✅ **Cotización generada exitosamente**\n\n📌 Servicio: ${serviceType}\n💰 Precio estimado: $${estimatedPrice.toLocaleString('es-CO')} COP\n\n${!isAgentAvailable ? '⏰ *Fuera de horario:* Un asesor te contactará en nuestro próximo horario de atención (Lunes a Viernes 09:00-12:00 y 14:00-18:00).\n\n' : '👨‍💼 Un asesor te contactará pronto para darte más detalles y completar tu cotización.\n\n'}¡Gracias por confiar en nosotros!`;

        return farewellMessage;
      }

      case 'waiting_for_agent':
      case 'human_mode': {
        // El bot se silencia cuando está en modo agente humano
        return null;
      }

      default: {
        // En caso de estado desconocido, reiniciar al estado idle
        await this.clientsService.update(client.id, {
          chat_state: 'idle',
        });

        const resetMessage = `He reiniciado la conversación. Escribe cualquier cosa para comenzar de nuevo.\n\n¡Bienvenido/a!`;

        return resetMessage;
      }
    }
  }

  /**
   * Normaliza el tipo de servicio ingresado por el usuario
   * @param text - Texto ingresado por el usuario
   * @returns Tipo de servicio normalizado
   */
  private normalizeServiceType(text: string): string {
    const normalizedText = text.toLowerCase().trim();

    if (normalizedText.includes('arl')) {
      return 'ARL';
    }
    if (normalizedText.includes('salud')) {
      return 'Salud';
    }
    if (normalizedText.includes('pens')) {
      return 'Pensión';
    }

    // Si no reconoce el servicio, usar el texto ingresado o ARL por defecto
    return text.trim() || 'ARL';
  }

  /**
   * Genera un precio estimado ficticio según el tipo de servicio
   * @param serviceType - Tipo de servicio
   * @returns Precio estimado en COP
   */
  private getEstimatedPrice(serviceType: string): number {
    const prices: Record<string, number> = {
      ARL: 450000,
      Salud: 850000,
      Pensión: 650000,
    };

    return prices[serviceType] || 500000;
  }
}
