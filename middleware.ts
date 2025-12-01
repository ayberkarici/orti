import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // If Supabase/Google redirects back to the root with a ?code=... param,
    // forward it to our dedicated auth callback route so that the session
    // can be exchanged and the user can be sent to the dashboard.
    if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.get("code")) {
        const code = request.nextUrl.searchParams.get("code");
        const callbackUrl = new URL("/auth/callback", request.url);
        if (code) {
            callbackUrl.searchParams.set("code", code);
        }
        return NextResponse.redirect(callbackUrl);
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is not signed in and trying to access dashboard, redirect to login
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user is signed in and trying to access login, redirect to dashboard
    if (user && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

export const config = {
    // We need middleware on:
    // - "/"        → to catch `/?code=...` after OAuth and forward to /auth/callback
    // - "/login"   → auth guard (signed-in users → /dashboard)
    // - "/dashboard/*" → protect dashboard routes
    matcher: ["/", "/dashboard/:path*", "/login"],
};
