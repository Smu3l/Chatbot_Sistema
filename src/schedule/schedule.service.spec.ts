// src/schedule/schedule.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service.js';
import { DateTime } from 'luxon';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAgentAvailableAt', () => {
    const timeZone = 'America/Bogota';

    // Pruebas para días laborables - Horario matutino (09:00 - 12:00)
    it('debe retornar true para Lunes a las 09:00', () => {
      const testDate = DateTime.fromObject({ weekday: 1, hour: 9, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    it('debe retornar true para Miércoles a las 10:30', () => {
      const testDate = DateTime.fromObject({ weekday: 3, hour: 10, minute: 30 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    it('debe retornar true para Viernes a las 11:59', () => {
      const testDate = DateTime.fromObject({ weekday: 5, hour: 11, minute: 59 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    // Pruebas para días laborables - Horario vespertino (14:00 - 18:00)
    it('debe retornar true para Lunes a las 14:00', () => {
      const testDate = DateTime.fromObject({ weekday: 1, hour: 14, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    it('debe retornar true para Martes a las 16:00', () => {
      const testDate = DateTime.fromObject({ weekday: 2, hour: 16, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    it('debe retornar true para Jueves a las 17:59', () => {
      const testDate = DateTime.fromObject({ weekday: 4, hour: 17, minute: 59 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(true);
    });

    // Pruebas de límites fuera de horario
    it('debe retornar false para Lunes a las 12:01 (después del horario matutino)', () => {
      const testDate = DateTime.fromObject({ weekday: 1, hour: 12, minute: 1 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Martes a las 13:59 (entre horarios)', () => {
      const testDate = DateTime.fromObject({ weekday: 2, hour: 13, minute: 59 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Miércoles a las 08:59 (antes del horario matutino)', () => {
      const testDate = DateTime.fromObject({ weekday: 3, hour: 8, minute: 59 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Jueves a las 18:00 (justo al límite, no incluido)', () => {
      const testDate = DateTime.fromObject({ weekday: 4, hour: 18, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Viernes a las 13:00 (hora de almuerzo)', () => {
      const testDate = DateTime.fromObject({ weekday: 5, hour: 13, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    // Pruebas para fines de semana
    it('debe retornar false para Sábado (no laborable)', () => {
      const testDate = DateTime.fromObject({ weekday: 6, hour: 10, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Domingo (no laborable)', () => {
      const testDate = DateTime.fromObject({ weekday: 7, hour: 15, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });

    it('debe retornar false para Domingo a las 09:00 (a pesar de estar en horario)', () => {
      const testDate = DateTime.fromObject({ weekday: 7, hour: 9, minute: 0 }, { zone: timeZone });
      expect(service.isAgentAvailableAt(testDate)).toBe(false);
    });
  });
});
