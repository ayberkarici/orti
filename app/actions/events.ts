"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(
    calendarId: string,
    data: {
        title: string;
        start_time: string;
        end_time: string;
        assigned_to?: string[];
    }
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Giriş yapmanız gerekiyor" };
    }

    const { data: event, error } = await supabase
        .from("events")
        .insert({
            calendar_id: calendarId,
            title: data.title,
            start_time: data.start_time,
            end_time: data.end_time,
            assigned_to: data.assigned_to || [],
            created_by: user.id,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/${calendarId}`);
    return { data: event };
}

export async function updateEvent(
    eventId: string,
    calendarId: string,
    data: {
        title?: string;
        start_time?: string;
        end_time?: string;
        assigned_to?: string[];
    }
) {
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from("events")
        .update(data)
        .eq("id", eventId)
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/${calendarId}`);
    return { data: event };
}

export async function deleteEvent(eventId: string, calendarId: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/${calendarId}`);
    return { success: true };
}

export async function getCalendarEvents(calendarId: string, startDate: string, endDate: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("calendar_id", calendarId)
        .gte("start_time", startDate)
        .lte("end_time", endDate)
        .order("start_time");

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }

    return data;
}

export async function saveDailyNote(
    calendarId: string,
    date: string,
    content: string
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Giriş yapmanız gerekiyor" };
    }

    const { data, error } = await supabase
        .from("daily_notes")
        .upsert(
            {
                calendar_id: calendarId,
                date,
                content,
                updated_by: user.id,
            },
            {
                onConflict: "calendar_id,date",
            }
        )
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/${calendarId}`);
    return { data };
}

export async function getDailyNote(calendarId: string, date: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("calendar_id", calendarId)
        .eq("date", date)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching daily note:", error);
        return null;
    }

    return data;
}

export async function getCalendarMembers(calendarId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("calendar_members")
        .select(
            `
      user_id,
      role,
      profiles (
        id,
        full_name,
        email,
        avatar_url,
        event_style
      )
    `
        )
        .eq("calendar_id", calendarId);

    if (error) {
        console.error("Error fetching members:", error);
        return [];
    }

    return data.map((item: any) => ({
        userId: item.user_id,
        role: item.role,
        name: item.profiles.full_name || item.profiles.email,
        email: item.profiles.email,
        avatarUrl: item.profiles.avatar_url,
        eventStyle: item.profiles.event_style ?? 0,
        isCurrentUser: user ? item.user_id === user.id : false,
    }));
}
