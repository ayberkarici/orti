"use client";

import { useState, useTransition } from "react";
import { Calendar, Users, Zap, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/app/actions/onboarding";

interface OnboardingDialogProps {
  initialOpen: boolean;
}

const steps = [
  {
    icon: Calendar,
    title: "Ortak takvimine hoş geldin",
    description:
      "Orti. ortakların aynı takvim üzerinde gerçek zamanlı çalışması için tasarlandı. Tek bir yerden tüm toplantı ve işleri takip edin.",
  },
  {
    icon: Users,
    title: "Ortağını davet et",
    description:
      "Takvim oluştur, davet kodunu paylaş ve ekip arkadaşlarını birkaç saniyede içeri al. Herkes aynı görünümü görür.",
  },
  {
    icon: Zap,
    title: "Planlamayı hızlandır",
    description:
      "Haftalık görünümde slotlara tıkla, görevleri paylaştır ve kimin ne yaptığını anında gör. Değişiklikler herkese anlık yansır.",
  },
];

export function OnboardingDialog({ initialOpen }: OnboardingDialogProps) {
  const [open, setOpen] = useState(initialOpen);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Son adım: onboarding'i tamamlama
      startTransition(async () => {
        setError(null);
        const result = await completeOnboarding();
        if ("error" in result && result.error) {
          setError("Onboarding bilgisi kaydedilirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.");
          return;
        }
        setOpen(false);
      });
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <Dialog open={open} onOpenChange={(value) => value === false && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Orti. ile tanış</DialogTitle>
          <DialogDescription>
            Ortak takviminizle planlama yapmadan önce kısaca göz atalım.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${index === currentStep
                  ? "w-6 bg-primary"
                  : "w-2 bg-slate-200"
                  }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-destructive text-center">
              {error}
            </p>
          )}

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isPending}
            >
              Daha sonra
            </Button>
            <Button
              onClick={handleNext}
              disabled={isPending}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Başla
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </>
              ) : (
                "İleri"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


