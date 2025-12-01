"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinCalendar } from "@/app/actions/calendar";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function JoinCalendarDialog() {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        const result = await joinCalendar(code);
        setLoading(false);

        if (result.error) {
            alert(result.error);
        } else {
            setCode("");
            setOpen(false);
            if (result.calendarId) {
                router.push(`/dashboard/${result.calendarId}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Takvime Katıl
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Takvime Katıl</DialogTitle>
                    <DialogDescription>
                        Davet kodunu girerek bir takvime katılabilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="code">Davet Kodu</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="ABC-123"
                                disabled={loading}
                                maxLength={7}
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading || !code.trim()}>
                            {loading ? "Katılınıyor..." : "Katıl"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
