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
import { createCalendar } from "@/app/actions/calendar";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateCalendarDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        const result = await createCalendar(name);
        setLoading(false);

        if (result.error) {
            alert(result.error);
        } else if (result.inviteCode) {
            setInviteCode(result.inviteCode);
            setName("");
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInviteCode(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Takvim
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Takvim Oluştur</DialogTitle>
                    <DialogDescription>
                        {inviteCode
                            ? "Takvim başarıyla oluşturuldu! Davet kodunu paylaşın."
                            : "İş ortaklarınızla paylaşacağınız bir takvim oluşturun."}
                    </DialogDescription>
                </DialogHeader>
                {inviteCode ? (
                    <div className="space-y-4">
                        <div className="bg-slate-100 p-4 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground mb-2">Davet Kodu</p>
                            <p className="text-3xl font-bold tracking-wider">{inviteCode}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Bu kodu ortaklarınızla paylaşın. Katılmak için bu kodu kullanabilirler.
                        </p>
                        <Button onClick={handleClose} className="w-full">
                            Tamam
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Takvim Adı</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Proje X Takvimi"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={loading || !name.trim()}>
                                {loading ? "Oluşturuluyor..." : "Oluştur"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
