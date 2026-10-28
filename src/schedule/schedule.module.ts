// src/schedule/schedule.module.ts

import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';
import { ScheduleController } from './schedule.controller.js';

/**
 * Módulo encargado de gestionar los horarios y disponibilidad de los asesores
 */
@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
