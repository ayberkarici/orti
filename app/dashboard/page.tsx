import { getUserCalendars } from "@/app/actions/calendar";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const calendars = await getUserCalendars();

    // If user has calendars, redirect to the first one
    if (calendars.length > 0) {
        redirect(`/dashboard/${calendars[0].id}`);
    }

    // Otherwise, show empty state
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-8">
                <h2 className="text-2xl font-bold mb-4">Takvim Bulunamadı</h2>
                <p className="text-muted-foreground mb-6">
                    Henüz hiç takviminiz yok. Soldaki menüden yeni bir takvim oluşturabilir
                    veya davet kodu ile bir takvime katılabilirsiniz.
                </p>
            </div>
        </div>
    );
}
