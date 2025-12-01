import { getCalendarEvents, getCalendarMembers } from "@/app/actions/events";
import { CalendarView } from "@/components/calendar/calendar-view";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addDays } from "date-fns";
import { MembersListDialog } from "@/components/calendar/members-list-dialog";
import { CalendarTitle } from "@/components/calendar/calendar-title";
import { InviteCode } from "@/components/calendar/invite-code";

interface CalendarPageProps {
    params: Promise<{
        calendarId: string;
    }>;
}

export default async function CalendarPage({ params }: CalendarPageProps) {
    const { calendarId } = await params;
    const supabase = await createClient();

    // Get calendar info
    const { data: calendar, error: calendarError } = await supabase
        .from("calendars")
        .select("*")
        .eq("id", calendarId)
        .single();

    // RLS nedeniyle kullanıcı bu takvime erişemiyorsa veya takvim yoksa
    // Supabase data'yı boş dönecek; bu durumda güvenli şekilde dashboard'a
    // yönlendiriyoruz.
    if (!calendar || calendarError) {
        redirect("/dashboard");
    }

    // Get events for a shorter window to keep calendar switches fast
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Start from last week
    const endDate = addDays(startDate, 30); // Next 1 month instead of 2

    const events = await getCalendarEvents(
        calendarId,
        startDate.toISOString(),
        endDate.toISOString()
    );

    const members = await getCalendarMembers(calendarId);

    return (
        <div className="h-full flex flex-col">
            <div className="border-b bg-white px-6 py-4 flex justify-between items-center">
                <div>
                    <CalendarTitle
                        calendarId={calendarId}
                        initialName={calendar?.name || "Takvim"}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                        Davet Kodu:{" "}
                        <InviteCode code={calendar?.invite_code ?? null} />
                    </p>
                </div>
                <MembersListDialog members={members} />
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
