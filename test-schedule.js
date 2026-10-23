// test-schedule.js
// Script de prueba para verificar el comportamiento de ScheduleService
import { DateTime } from 'luxon';

// Simulamos la lógica del servicio
class ScheduleServiceTest {
  private readonly timeZone = 'America/Bogota';

  isAgentAvailableAt(dateTime) {
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

const service = new ScheduleServiceTest();
const timeZone = 'America/Bogota';

console.log('=== PRUEBAS DE DISPONIBILIDAD DE ASESORES ===');
console.log('Zona horaria:', timeZone);
console.log('Horarios: Lunes-Viernes | 09:00-12:00 y 14:00-18:00\n');

// Casos válidos
console.log('✅ CASOS QUE DEBEN RETORNAR TRUE:');
console.log('Lunes 09:00:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 1, hour: 9, minute: 0 }, { zone: timeZone })));
console.log('Martes 10:30:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 2, hour: 10, minute: 30 }, { zone: timeZone })));
console.log('Miércoles 11:59:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 3, hour: 11, minute: 59 }, { zone: timeZone })));
console.log('Jueves 14:00:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 4, hour: 14, minute: 0 }, { zone: timeZone })));
console.log('Viernes 16:45:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 5, hour: 16, minute: 45 }, { zone: timeZone })));
console.log('Viernes 17:59:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 5, hour: 17, minute: 59 }, { zone: timeZone })));

console.log('\n❌ CASOS QUE DEBEN RETORNAR FALSE:');
console.log('Lunes 08:59 (antes):', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 1, hour: 8, minute: 59 }, { zone: timeZone })));
console.log('Lunes 12:01 (después mañana):', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 1, hour: 12, minute: 1 }, { zone: timeZone })));
console.log('Martes 13:59 (entre horarios):', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 2, hour: 13, minute: 59 }, { zone: timeZone })));
console.log('Miércoles 14:00? NO - 13:00:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 3, hour: 13, minute: 0 }, { zone: timeZone })));
console.log('Jueves 18:00 (límite exacto):', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 4, hour: 18, minute: 0 }, { zone: timeZone })));
console.log('Viernes 18:01 (después tarde):', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 5, hour: 18, minute: 1 }, { zone: timeZone })));
console.log('Sábado 10:00:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 6, hour: 10, minute: 0 }, { zone: timeZone })));
console.log('Domingo 15:00:', service.isAgentAvailableAt(DateTime.fromObject({ weekday: 7, hour: 15, minute: 0 }, { zone: timeZone })));

console.log('\n=== FIN DE PRUEBAS ===');
