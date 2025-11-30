import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getUserCalendars } from "@/app/actions/calendar";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ calendarId?: string }>;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const calendars = await getUserCalendars();
    const { calendarId } = await params;

    return (
        <div className="flex h-screen">
            <DashboardSidebar
                user={{
                    email: profile?.email || user.email || "",
                    full_name: profile?.full_name || null,
                    avatar_url: profile?.avatar_url || null,
                }}
                calendars={calendars}
                activeCalendarId={calendarId}
            />
            <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
        </div>
    );
}
