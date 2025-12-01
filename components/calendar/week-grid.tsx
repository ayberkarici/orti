"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addWeeks, subWeeks } from "date-fns";
import {
    getWeekStart,
    getWeekDays,
    formatDate,
    getHourSlots,
    formatHour,
    isSameDayUtil,
} from "@/lib/calendar-utils";

interface WeekGridProps {
    calendarId: string;
    events: Array<{
        id: string;
        title: string;
        start_time: string;
        end_time: string;
        assigned_to: string[];
        created_by?: string | null;
    }>;
    memberStyles: Record<string, number>;
    onSlotClick: (date: Date, hour: number) => void;
    onEventClick: (eventId: string) => void;
}

export function WeekGrid({
    calendarId,
    events,
    memberStyles,
    onSlotClick,
    onEventClick,
}: WeekGridProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekStart = getWeekStart(currentDate);
    const weekDays = getWeekDays(weekStart);
    const hours = getHourSlots();

    const goToPreviousWeek = () => {
        setCurrentDate((prev) => subWeeks(prev, 1));
    };

    const goToNextWeek = () => {
        setCurrentDate((prev) => addWeeks(prev, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (date: Date) => isSameDayUtil(date, new Date());

    const getEventsForSlot = (date: Date, hour: number) => {
        return events.filter((event) => {
            const eventStart = new Date(event.start_time);
            const eventHour = eventStart.getHours();
            return isSameDayUtil(eventStart, date) && eventHour === hour;
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Sticky header: navigation + day names birlikte */}
            <div className="sticky top-0 z-20 bg-white">
                <div className="border-b px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold sm:text-2xl">
                            {formatDate(weekStart, "d MMMM yyyy")} -{" "}
                            {formatDate(weekDays[6], "d MMMM yyyy")}
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={goToToday}>
                                Bugün
                            </Button>
                            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={goToNextWeek}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Day Headers */}
                <div className="border-b">
                    <div className="flex">
                        <div className="w-16 sm:w-20 flex-shrink-0 border-r" />
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className={`flex-1 min-w-[90px] sm:min-w-[120px] px-2 sm:px-4 py-2 sm:py-3 border-r ${isToday(day) ? "bg-primary/5" : ""
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground uppercase">
                                        {formatDate(day, "EEE")}
                                    </div>
                                    <div
                                        className={`text-lg font-semibold ${isToday(day) ? "text-primary" : ""
                                            }`}
                                    >
                                        {formatDate(day, "d")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Calendar Grid */}
            <div className="flex-1 overflow-x-auto">
                <div className="min-w-max">
                    {/* Time Slots */}
                    <div>
                        {hours.map((hour) => (
                            <div key={hour} className="flex border-b">
                                {/* Hour Label */}
                                <div className="w-16 sm:w-20 flex-shrink-0 border-r px-1.5 sm:px-2 py-2 text-[10px] sm:text-sm text-muted-foreground text-right">
                                    {formatHour(hour)}
                                </div>

                                {/* Day Cells */}
                                {weekDays.map((day, dayIndex) => {
                                    const slotEvents = getEventsForSlot(day, hour);
                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`flex-1 min-w-[90px] sm:min-w-[120px] min-h-[48px] sm:min-h-[60px] border-r p-1 cursor-pointer hover:bg-slate-50 transition-colors ${isToday(day) ? "bg-primary/5" : ""
                                                }`}
                                            onClick={() => onSlotClick(day, hour)}
                                        >
                                            {slotEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventClick(event.id);
                                                    }}
                                                    className={cn(
                                                        "text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-90 text-white",
                                                        `event-pattern-${Math.max(
                                                            0,
                                                            Math.min(
                                                                5,
                                                                event.created_by && memberStyles[event.created_by] !== undefined
                                                                    ? memberStyles[event.created_by]
                                                                    : 0
                                                            )
                                                        )}`
                                                    )}
                                                >
                                                    <div className="font-medium truncate">{event.title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
