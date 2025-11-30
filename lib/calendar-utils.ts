import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale/tr";

/**
 * Gets the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Gets all days in a week starting from Monday
 */
export function getWeekDays(weekStart: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr, { locale: tr });
}

/**
 * Checks if two dates are the same day
 */
export function isSameDayUtil(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
}

/**
 * Gets hour slots for the calendar (8:00 - 23:00)
 */
export function getHourSlots(): number[] {
    return Array.from({ length: 16 }, (_, i) => i + 8); // 8 to 23
}

/**
 * Formats hour for display
 */
export function formatHour(hour: number): string {
    return `${hour.toString().padStart(2, "0")}:00`;
}
