import { DateTime } from 'luxon';
export declare class ScheduleService {
    private readonly timeZone;
    isAgentAvailable(): boolean;
    getCurrentScheduleInfo(): {
        dateTime: string | null;
        weekday: number;
        weekdayName: string | null;
        time: string;
        timeZone: string;
        isAvailable: boolean;
    };
    isAgentAvailableAt(dateTime: DateTime): boolean;
}
