import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getUserCalendars } from "@/app/actions/calendar";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
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

    return (
        <div className="flex h-screen">
            <DashboardSidebar
                user={{
                    email: profile?.email || user.email || "",
                    full_name: profile?.full_name || null,
                    avatar_url: profile?.avatar_url || null,
                }}
                calendars={calendars}
            />
            <main className="flex-1 overflow-auto bg-slate-50 relative">
                {/* Mobile top bar with sidebar toggle */}
                <div className="md:hidden sticky top-0 z-30 border-b bg-white px-4 py-3 flex items-center justify-between">
                    <MobileSidebar
                        user={{
                            email: profile?.email || user.email || "",
                            full_name: profile?.full_name || null,
                            avatar_url: profile?.avatar_url || null,
                        }}
                        calendars={calendars}
                    />
                    <span className="text-sm font-semibold text-slate-800">
                        Orti. Takvim
                    </span>
                </div>
                <OnboardingDialog initialOpen={!profile?.onboarded} />
                {children}
            </main>
        </div>
    );
}
