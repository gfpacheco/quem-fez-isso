"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

type ShareButtonProps = {
  text: string;
};

const toastDuration = 2000;

export function ShareButton({ text }: ShareButtonProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast === null) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), toastDuration);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function share() {
    if (await shareNatively(text)) {
      return;
    }

    setToast((await copyToClipboard(text)) ? "Copiado!" : "Não deu pra copiar");
  }

  return (
    <>
      <Button onClick={share} className="w-full">
        Compartilhar
      </Button>
      <Toast message={toast} />
    </>
  );
}

async function shareNatively(text: string) {
  if (typeof navigator.share !== "function") {
    return false;
  }

  try {
    await navigator.share({ text });

    return true;
  } catch (error) {
    // The user dismissed the share sheet: nothing else to do
    return error instanceof DOMException && error.name === "AbortError";
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
}
