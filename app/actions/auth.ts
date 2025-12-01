"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

export async function signInWithGoogle() {
    const supabase = await createClient();
    // Determine the correct origin for redirect URLs using our helper.
    // - In development: http://localhost:3000
    // - In production: https://orti.space (or NEXT_PUBLIC_SITE_URL if set)
    const origin = getBaseUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                // offline access so Supabase can keep a long-lived session,
                // but we don't force the consent screen every single time.
                access_type: "offline",
            },
        },
    });

    if (error) {
        console.error("Login error:", error);
        return { error: error.message };
    }

    if (data.url) {
        redirect(data.url);
    }

    return { error: "No redirect URL returned" };
}
