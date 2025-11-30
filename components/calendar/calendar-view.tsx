"use client";

import { WeekGrid } from "@/components/calendar/week-grid";
import { EventDialog } from "@/components/calendar/event-dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface CalendarViewProps {
    calendarId: string;
    initialEvents: any[];
    members: Array<{
        userId: string;
        name: string;
    }>;
}

export function CalendarView({
    calendarId,
    initialEvents,
    members,
}: CalendarViewProps) {
    const [events, setEvents] = useState(initialEvents);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedHour, setSelectedHour] = useState<number | undefined>();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    // Sync state with server data when revalidatePath happens
    useEffect(() => {
        setEvents(initialEvents);
    }, [initialEvents]);

    // Real-time subscription for events
    useEffect(() => {
        const channel = supabase
            .channel(`calendar-${calendarId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "events",
                    filter: `calendar_id=eq.${calendarId}`,
                },
                (payload) => {
                    console.log("Change received!", payload);

                    if (payload.eventType === "INSERT") {
                        setEvents((prev) => [...prev, payload.new]);
                    } else if (payload.eventType === "UPDATE") {
                        setEvents((prev) =>
                            prev.map((event) =>
                                event.id === payload.new.id ? payload.new : event
                            )
                        );
                    } else if (payload.eventType === "DELETE") {
                        setEvents((prev) =>
                            prev.filter((event) => event.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [calendarId]);

    const handleSlotClick = (date: Date, hour: number) => {
        setSelectedDate(date);
        setSelectedHour(hour);
        setSelectedEvent(null);
        setDialogOpen(true);
    };

    const handleEventClick = (eventId: string) => {
        const event = events.find((e) => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setSelectedDate(undefined);
            setSelectedHour(undefined);
            setDialogOpen(true);
        }
    };

    return (
        <>
            <WeekGrid
                calendarId={calendarId}
                events={events}
                onSlotClick={handleSlotClick}
                onEventClick={handleEventClick}
            />
            <EventDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                calendarId={calendarId}
                date={selectedDate}
                hour={selectedHour}
                event={selectedEvent}
                members={members}
            />
        </>
    );
}
