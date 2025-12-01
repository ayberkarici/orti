"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Shield, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateEventStyle } from "@/app/actions/profile";
import { useTransition } from "react";

interface Member {
    userId: string;
    role: "admin" | "member";
    name: string;
    email: string;
    avatarUrl?: string;
    eventStyle?: number;
    isCurrentUser?: boolean;
}

interface MembersListDialogProps {
    members: Member[];
}

export function MembersListDialog({ members }: MembersListDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleStyleChange = (styleIndex: number) => {
        startTransition(async () => {
            await updateEventStyle(styleIndex);
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Kişiler ({members.length})
                </Button>
            </DialogTrigger>
            {/* Radix erişilebilirlik uyarısını engellemek için, bu dialogda
                açıklama kullanmadığımızdan aria-describedby'yi açıkça kaldırıyoruz. */}
            <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Orti'ler</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-4 mt-4">
                        {members.map((member) => (
                            <div
                                key={member.userId}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} />
                                        <AvatarFallback>
                                            {member.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                        {member.role === "admin" ? (
                                            <>
                                                <Shield className="h-3 w-3" />
                                                <span>Yönetici</span>
                                            </>
                                        ) : (
                                            <>
                                                <User className="h-3 w-3" />
                                                <span>Üye</span>
                                            </>
                                        )}
                                    </div>
                                    {member.isCurrentUser && (
                                        <div className="flex gap-1">
                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() => handleStyleChange(index)}
                                                    className={`h-5 w-5 rounded-full border border-slate-300 overflow-hidden event-pattern-${index}`}
                                                    aria-label={`Etkinlik stili ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
