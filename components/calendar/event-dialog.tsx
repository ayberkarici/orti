"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface EventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    calendarId: string;
    date?: Date;
    hour?: number;
    event?: {
        id: string;
        title: string;
        start_time: string;
        end_time: string;
        assigned_to: string[];
    } | null;
    members: Array<{
        userId: string;
        name: string;
    }>;
}

export function EventDialog({
    open,
    onOpenChange,
    calendarId,
    date,
    hour,
    event,
    members,
}: EventDialogProps) {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStartTime(format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"));
            setEndTime(format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"));
        } else if (date && hour !== undefined) {
            const start = new Date(date);
            start.setHours(hour, 0, 0, 0);
            const end = new Date(start);
            end.setHours(hour + 1, 0, 0, 0);

            setStartTime(format(start, "yyyy-MM-dd'T'HH:mm"));
            setEndTime(format(end, "yyyy-MM-dd'T'HH:mm"));
            setTitle("");
        }
    }, [event, date, hour]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (event) {
            const result = await updateEvent(event.id, calendarId, {
                title,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
            });

            if (result.error) {
                alert(result.error);
            } else {
                onOpenChange(false);
            }
        } else {
            const result = await createEvent(calendarId, {
                title,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
            });

            if (result.error) {
                alert(result.error);
            } else {
                onOpenChange(false);
            }
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        if (!event) return;

        if (!confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) return;

        setLoading(true);
        const result = await deleteEvent(event.id, calendarId);

        if (result.error) {
            alert(result.error);
        } else {
            onOpenChange(false);
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {event ? "Etkinliği Düzenle" : "Yeni Etkinlik"}
                    </DialogTitle>
                    <DialogDescription>
                        {event
                            ? "Etkinlik bilgilerini güncelleyin"
                            : "Takvime yeni bir etkinlik ekleyin"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Başlık</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Etkinlik başlığı"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="start">Başlangıç</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="end">Bitiş</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        {event && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Sil
                            </Button>
                        )}
                        <Button type="submit" disabled={loading || !title.trim()}>
                            {loading ? "Kaydediliyor..." : event ? "Güncelle" : "Oluştur"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
