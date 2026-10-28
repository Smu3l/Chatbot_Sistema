// src/schedule/schedule.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';
import { DateTime } from 'luxon';

/**
 * Controlador REST para la gestión de horarios y disponibilidad de asesores
 * Ruta base: /schedule
 */
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * GET /schedule/status
   * Endpoint de prueba para verificar la disponibilidad actual de los asesores
   * @returns JSON con hora actual en Bogotá y estado de disponibilidad
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  getStatus() {
    // Obtener información actual en zona horaria America/Bogota
    const now = DateTime.now().setZone('America/Bogota');
    
    // Verificar disponibilidad de asesores
    const isAvailable = this.scheduleService.isAgentAvailable();

    return {
      timezone: 'America/Bogota',
      currentDateTime: now.toISO(),
      currentTime: now.toFormat('HH:mm:ss'),
      currentDate: now.toFormat('yyyy-MM-dd'),
      weekday: now.weekday,
      weekdayName: now.weekdayLong,
      isAgentAvailable: isAvailable,
      status: isAvailable ? 'available' : 'not_available',
      message: isAvailable 
        ? 'Los asesores se encuentran disponibles en este horario.' 
        : 'Los asesores no se encuentran disponibles en este horario.',
    };
  }
}
