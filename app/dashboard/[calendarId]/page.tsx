import { getCalendarEvents, getCalendarMembers } from "@/app/actions/events";
import { CalendarView } from "@/components/calendar/calendar-view";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addDays } from "date-fns";

interface CalendarPageProps {
    params: Promise<{
        calendarId: string;
    }>;
}

export default async function CalendarPage({ params }: CalendarPageProps) {
    const { calendarId } = await params;
    const supabase = await createClient();

    // Check if user has access to this calendar
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: membership } = await supabase
        .from("calendar_members")
        .select("*")
        .eq("calendar_id", calendarId)
        .eq("user_id", user.id)
        .single();

    if (!membership) {
        redirect("/dashboard");
    }

    // Get calendar info
    const { data: calendar } = await supabase
        .from("calendars")
        .select("*")
        .eq("id", calendarId)
        .single();

    // Get events for the next month
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Start from last week
    const endDate = addDays(startDate, 60); // Next 2 months

    const events = await getCalendarEvents(
        calendarId,
        startDate.toISOString(),
        endDate.toISOString()
    );

    const members = await getCalendarMembers(calendarId);

    return (
        <div className="h-full flex flex-col">
            <div className="border-b bg-white px-6 py-4">
                <h1 className="text-3xl font-bold">{calendar?.name || "Takvim"}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Davet Kodu: <span className="font-mono font-semibold">{calendar?.invite_code}</span>
                </p>
            </div>
            <div className="flex-1">
                <CalendarView
                    calendarId={calendarId}
                    initialEvents={events}
                    members={members}
                />
            </div>
        </div>
    );
}
