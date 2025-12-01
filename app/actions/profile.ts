"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateEventStyle(styleIndex: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmanız gerekiyor" };
  }

  if (styleIndex < 0 || styleIndex > 5) {
    return { error: "Geçersiz stil seçimi" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ event_style: styleIndex })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating event style:", error);
    return { error: error.message };
  }

  return { success: true };
}


