var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
let ScheduleService = class ScheduleService {
    timeZone = 'America/Bogota';
    isAgentAvailable() {
        const now = DateTime.now().setZone(this.timeZone);
        const weekday = now.weekday;
        if (weekday < 1 || weekday > 5) {
            return false;
        }
        const currentHour = now.hour;
        const currentMinute = now.minute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        const morningStart = 9 * 60;
        const morningEnd = 12 * 60;
        const afternoonStart = 14 * 60;
        const afternoonEnd = 18 * 60;
        const isInMorningSchedule = currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd;
        const isInAfternoonSchedule = currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd;
        return isInMorningSchedule || isInAfternoonSchedule;
    }
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
};
ScheduleService = __decorate([
    Injectable()
], ScheduleService);
export { ScheduleService };
//# sourceMappingURL=schedule.service.js.map