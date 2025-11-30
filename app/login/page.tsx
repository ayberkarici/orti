"use client";

import { signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await signInWithGoogle();

            if (result && result.error) {
                setError(result.error);
                setLoading(false);
            }
            // Redirect happens automatically in the server action
        } catch (err) {
            setError("Giriş yapılırken bir hata oluştu");
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Orti&apos;ye Hoş Geldiniz</CardTitle>
                    <CardDescription>
                        Devam etmek için Google hesabınızla giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? "Yükleniyor..." : "Google ile Giriş Yap"}
                    </Button>
                    {error && (
                        <p className="text-sm text-destructive text-center mt-4">{error}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
