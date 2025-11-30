/**
 * Generates a unique invite code with collision checking
 * Format: XXX-XXX (e.g., "ABC-123")
 */
export async function generateUniqueInviteCode(supabase: any): Promise<string> {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate a 6-character code with a dash in the middle
        let code = "";
        for (let i = 0; i < 6; i++) {
            if (i === 3) {
                code += "-";
            }
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        // Check if this code already exists in the database
        const { data, error } = await supabase
            .from("calendars")
            .select("invite_code")
            .eq("invite_code", code)
            .single();

        // If no data found, the code is unique
        if (!data && error?.code === "PGRST116") {
            return code;
        }

        // If we got data back, this code exists - try again
        if (data) {
            continue;
        }

        // If there was a different error, throw it
        if (error && error.code !== "PGRST116") {
            throw error;
        }
    }

    throw new Error("Failed to generate unique invite code after maximum attempts");
}

/**
 * Validates if an invite code exists and returns the calendar
 */
export async function validateInviteCode(supabase: any, code: string) {
    const { data, error } = await supabase
        .from("calendars")
        .select("*")
        .eq("invite_code", code.toUpperCase())
        .single();

    if (error) {
        return null;
    }

    return data;
}
