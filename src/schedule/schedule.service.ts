// src/schedule/schedule.service.ts

import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

/**
 * Servicio encargado de gestionar la disponibilidad de los asesores
 * basado en horarios laborales configurados.
 */
@Injectable()
export class ScheduleService {
  /**
   * Zona horaria por defecto configurada para Colombia
   */
  private readonly timeZone: string = 'America/Bogota';

  /**
   * Verifica si un agente/asesor se encuentra disponible en el momento actual
   * 
   * Reglas de disponibilidad:
   * - Solo de Lunes a Viernes (weekday entre 1-5 según Luxon: 1=Lunes, 7=Domingo)
   * - Horario 1: 09:00 - 12:00
   * - Horario 2: 14:00 - 18:00
   * 
   * @returns true si está dentro de los horarios permitidos, false en caso contrario
   */
  isAgentAvailable(): boolean {
    // Obtener la fecha/hora actual en zona horaria America/Bogota
    const now = DateTime.now().setZone(this.timeZone);

    // Obtener el día de la semana (1 = Lunes, 7 = Domingo)
    const weekday = now.weekday;

    // Verificar que sea de Lunes a Viernes
    if (weekday < 1 || weekday > 5) {
      return false;
    }

    // Obtener la hora actual en formato decimal para facilitar comparación
    const currentHour = now.hour;
    const currentMinute = now.minute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Horario 1: 09:00 - 12:00 (540 minutos - 720 minutos)
    const morningStart = 9 * 60; // 09:00
    const morningEnd = 12 * 60; // 12:00

    // Horario 2: 14:00 - 18:00 (840 minutos - 1080 minutos)
    const afternoonStart = 14 * 60; // 14:00
    const afternoonEnd = 18 * 60; // 18:00

    // Verificar si está dentro del horario matutino (09:00 <= hora < 12:00)
    const isInMorningSchedule = currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd;

    // Verificar si está dentro del horario vespertino (14:00 <= hora < 18:00)
    const isInAfternoonSchedule = currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd;

    // Disponible solo si está en alguno de los dos horarios
    return isInMorningSchedule || isInAfternoonSchedule;
  }

  /**
   * Obtiene la información actual del horario en zona horaria America/Bogota
   * Útil para debugging y pruebas
   * @returns Objeto con información de fecha/hora actual
   */
  getCurrentScheduleInfo() {
    const now = DateTime.now().setZone(this.timeZone);
    return {
      dateTime: now.toISO(),
      weekday: now.weekday,
      weekdayName: now.weekdayLong,
      time: now.toFormat('HH:mm'),
      timeZone: this.timeZone,
      isAvailable: this.isAgentAvailable(),
    };
  }

  /**
   * Verifica disponibilidad para una fecha/hora específica (útil para testing)
   * @param dateTime - Fecha y hora a verificar
   * @returns true si está disponible en esa fecha/hora
   */
  isAgentAvailableAt(dateTime: DateTime): boolean {
    const now = dateTime.setZone(this.timeZone);
    const weekday = now.weekday;

    if (weekday < 1 || weekday > 5) {
      return false;
    }

    const currentTimeInMinutes = now.hour * 60 + now.minute;
    const morningStart = 9 * 60;
    const morningEnd = 12 * 60;
    const afternoonStart = 14 * 60;
    const afternoonEnd = 18 * 60;

    const isInMorningSchedule = currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd;
    const isInAfternoonSchedule = currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd;

    return isInMorningSchedule || isInAfternoonSchedule;
  }
}
