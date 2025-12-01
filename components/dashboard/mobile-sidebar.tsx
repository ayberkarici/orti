"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, LogOut, Menu, X } from "lucide-react";
import { CreateCalendarDialog } from "@/components/calendar/create-calendar-dialog";
import { JoinCalendarDialog } from "@/components/calendar/join-calendar-dialog";
import { supabase } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface MobileSidebarProps {
  user: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  calendars: Array<{
    id: string;
    name: string;
    invite_code: string;
    userRole: string;
  }>;
}

export function MobileSidebar({ user, calendars }: MobileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeCalendarId =
    pathname?.startsWith("/dashboard/") ? pathname.split("/")[2] : undefined;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setOpen(false);
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menüyü aç</span>
      </Button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">Orti.</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.full_name || "Kullanıcı"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Calendars List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2 mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                  Takvimler
                </h3>
                {calendars.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Henüz takvim yok. Yeni bir takvim oluşturun veya bir takvime
                    katılın.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {calendars.map((calendar) => {
                      const isActive = activeCalendarId === calendar.id;

                      return (
                        <button
                          key={calendar.id}
                          type="button"
                          onClick={() =>
                            handleNavigate(`/dashboard/${calendar.id}`)
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border-l-2 ${
                            isActive
                              ? "bg-primary/10 text-slate-900 border-primary"
                              : "hover:bg-slate-100 border-transparent"
                          }`}
                        >
                          <div
                            className={`font-medium ${
                              isActive ? "font-semibold" : ""
                            }`}
                          >
                            {calendar.name}
                          </div>
                          <div className="text-xs opacity-75">
                            {calendar.invite_code}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t space-y-3">
              <div className="space-y-2">
                <CreateCalendarDialog />
                <JoinCalendarDialog />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}



