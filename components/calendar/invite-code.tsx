"use client";

import { useState, useEffect } from "react";

interface InviteCodeProps {
  code?: string | null;
}

export function InviteCode({ code }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timeout);
  }, [copied]);

  if (!code) {
    return (
      <span className="font-mono font-semibold text-muted-foreground">
        -
      </span>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 font-mono font-semibold text-slate-800 hover:text-primary focus:outline-none"
    >
      <span className="underline decoration-dotted underline-offset-4">
        {code}
      </span>
      {copied && (
        <span className="text-xs text-primary">
          Kopyalandı
        </span>
      )}
    </button>
  );
}


