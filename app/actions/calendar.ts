"use server";

import { createClient } from "@/lib/supabase/server";
import { generateUniqueInviteCode } from "@/lib/invite-code";
import { revalidatePath } from "next/cache";

export async function createCalendar(name: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Giriş yapmanız gerekiyor" };
    }

    try {
        // Generate unique invite code with collision checking
        const inviteCode = await generateUniqueInviteCode(supabase);

        const { data, error } = await supabase
            .from("calendars")
            .insert({
                name,
                invite_code: inviteCode,
                owner_id: user.id,
            })
            .select()
            .single();

        if (error) {
            return { error: error.message };
        }

        revalidatePath("/dashboard");
        return { data, inviteCode };
    } catch (error) {
        console.error("Error creating calendar:", error);
        return { error: "Takvim oluşturulurken bir hata oluştu" };
    }
}

export async function joinCalendar(inviteCode: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Giriş yapmanız gerekiyor" };
    }

    try {
        // Find calendar by invite code
        const { data: calendar, error: calendarError } = await supabase
            .from("calendars")
            .select("id")
            .eq("invite_code", inviteCode.toUpperCase())
            .single();

        if (calendarError || !calendar) {
            return { error: "Geçersiz davet kodu" };
        }

        // Check if user is already a member
        const { data: existingMember } = await supabase
            .from("calendar_members")
            .select("*")
            .eq("calendar_id", calendar.id)
            .eq("user_id", user.id)
            .single();

        if (existingMember) {
            return { error: "Zaten bu takvimin üyesisiniz" };
        }

        // Add user as member
        const { error: memberError } = await supabase
            .from("calendar_members")
            .insert({
                calendar_id: calendar.id,
                user_id: user.id,
                role: "member",
            });

        if (memberError) {
            return { error: memberError.message };
        }

        revalidatePath("/dashboard");
        return { success: true, calendarId: calendar.id };
    } catch (error) {
        console.error("Error joining calendar:", error);
        return { error: "Takvime katılırken bir hata oluştu" };
    }
}

export async function getUserCalendars() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from("calendar_members")
        .select(
            `
      calendar_id,
      role,
      calendars (
        id,
        name,
        invite_code,
        owner_id
      )
    `
        )
        .eq("user_id", user.id);

    if (error) {
        console.error("Error fetching calendars:", error);
        return [];
    }

    return data.map((item: any) => ({
        ...item.calendars,
        userRole: item.role,
    }));
}
