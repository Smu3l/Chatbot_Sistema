// src/whatsapp/whatsapp.controller.ts

import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { WhatsappService } from './whatsapp.service.js';

/**
 * Controlador para el webhook de WhatsApp Cloud API (Meta)
 * Maneja la verificación del webhook y recepción de mensajes entrantes
 */
@Controller('webhook')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  /**
   * GET /webhook
   * Endpoint para la verificación del webhook por parte de Meta
   * Debe validar el hub.verify_token y retornar hub.challenge en texto plano
   */
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    this.logger.log('Verificación de webhook recibida de Meta');

    // Validar que el modo sea subscribe y el token
    if (mode === 'subscribe' && verifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
      this.logger.log('Token de verificación válido - Webhook verificado');
      // Retornar únicamente hub.challenge como texto plano con HTTP 200
      return res.status(200).type('text/plain').send(challenge);
    }

    this.logger.error('Verificación de webhook fallida');
    return res.status(403).send('Forbidden');
  }

  /**
   * POST /webhook
   * Endpoint para recibir mensajes entrantes de WhatsApp
   * Siempre debe retornar 200 OK para evitar que Meta suspenda el webhook
   * @param req - Request con el payload de Meta
   * @param res - Response de Express
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async receiveMessage(@Req() req: Request, @Res() res: Response) {
    try {
      // Retornar 200 OK inmediatamente para evitar suspensión del webhook
      res.status(HttpStatus.OK).send('EVENT_RECEIVED');

      const body = req.body;

      // Verificar que sea una notificación de WhatsApp
      if (body.object === 'whatsapp_business_account') {
        // Procesar cada entrada
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            const value = change.value;

            // Verificar si hay mensajes entrantes
            if (value.messages && value.messages.length > 0) {
              for (const message of value.messages) {
                // Solo procesar mensajes de texto
                if (message.type === 'text') {
                  const phoneNumber = message.from;
                  const messageText = message.text.body;

                  this.logger.log(
                    `Procesando mensaje entrante de ${phoneNumber}: ${messageText}`,
                  );

                  // Procesar mensaje de forma asíncrona (24/7)
                  // El bot responde automáticamente sin bloquear el webhook
                  this.whatsappService
                    .handleIncomingMessage(phoneNumber, messageText)
                    .catch((error) => {
                      this.logger.error(
                        `Error en procesamiento asíncrono: ${error.message}`,
                      );
                    });
                } else {
                  this.logger.log(
                    `Tipo de mensaje no soportado: ${message.type} de ${message.from}`,
                  );
                }
              }
            }

            // Log de otros tipos de eventos si es necesario
            if (value.statuses) {
              this.logger.debug('Estados de mensaje recibidos');
            }
          }
        }
    } else {
        this.logger.warn('Objeto no reconocido en webhook de WhatsApp');
      }
    } catch (error: any) {
      this.logger.error(`Error en webhook POST: ${error.message}`);
      // Asegurar que siempre se retorne 200 OK
      if (!res.headersSent) {
        res.status(HttpStatus.OK).send('EVENT_RECEIVED');
      }
    }
  }
}
