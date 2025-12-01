"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmanız gerekiyor" };
  }

  // Bazı eski kullanıcıların profiles kaydı olmayabilir.
  // Bu nedenle upsert kullanarak hem var olan kaydı güncelliyor
  // hem de yoksa oluşturuyoruz.
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: (user.user_metadata as any)?.full_name ?? null,
        avatar_url: (user.user_metadata as any)?.avatar_url ?? null,
        onboarded: true,
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    console.error("Error completing onboarding:", error);
    return { error: error.message || "Onboarding güncellenemedi" };
  }

  return { success: true };
}


