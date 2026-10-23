import { DateTime } from 'luxon';
const tz = 'America/Bogota';
function isAgentAvailableAt(dateTime) {
  const now = dateTime.setZone(tz);
  const weekday = now.weekday;
  if (weekday < 1 || weekday > 5) return false;
  const currentTimeInMinutes = now.hour * 60 + now.minute;
  const morningStart = 9 * 60, morningEnd = 12 * 60;
  const afternoonStart = 14 * 60, afternoonEnd = 18 * 60;
  const isInMorning = currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd;
  const isInAfternoon = currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd;
  return isInMorning || isInAfternoon;
}
console.log('Lunes 09:00 ->', isAgentAvailableAt(DateTime.fromObject({weekday:1,hour:9,minute:0},{zone:tz})));
console.log('Lunes 12:01 ->', isAgentAvailableAt(DateTime.fromObject({weekday:1,hour:12,minute:1},{zone:tz})));
console.log('Martes 13:59 ->', isAgentAvailableAt(DateTime.fromObject({weekday:2,hour:13,minute:59},{zone:tz})));
console.log('Viernes 17:59 ->', isAgentAvailableAt(DateTime.fromObject({weekday:5,hour:17,minute:59},{zone:tz})));
console.log('Jueves 18:00 ->', isAgentAvailableAt(DateTime.fromObject({weekday:4,hour:18,minute:0},{zone:tz})));
console.log('Sabado 10:00 ->', isAgentAvailableAt(DateTime.fromObject({weekday:6,hour:10,minute:0},{zone:tz})));
console.log('Domingo 15:00 ->', isAgentAvailableAt(DateTime.fromObject({weekday:7,hour:15,minute:0},{zone:tz})));
