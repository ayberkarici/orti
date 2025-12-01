"use client";

import { useState, useTransition, FormEvent } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { renameCalendar } from "@/app/actions/calendar";
import { useRouter } from "next/navigation";

interface CalendarTitleProps {
  calendarId: string;
  initialName: string;
}

export function CalendarTitle({ calendarId, initialName }: CalendarTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === initialName) {
      setIsEditing(false);
      setError(null);
      setName(initialName);
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await renameCalendar(calendarId, name.trim());

      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }

      // Başarılı ise UI'ı güncelle
      setIsEditing(false);
      router.refresh();
    });
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="max-w-sm"
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isPending}
            aria-label="Kaydet"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isPending}
            onClick={() => {
              setIsEditing(false);
              setName(initialName);
              setError(null);
            }}
            aria-label="İptal"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
        {error && (
          <p className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-3xl font-bold">{initialName}</h1>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Takvim adını düzenle"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}


