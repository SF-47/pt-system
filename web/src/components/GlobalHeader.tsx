"use client";

import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

function getTrainerName() {
  try {
    const token = localStorage.getItem("token");
    const encodedPayload = token?.split(".")[1];

    if (!encodedPayload) return "Trainer";

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedBase64)) as Record<string, unknown>;
    const name =
      payload.unique_name ??
      payload.name ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    return typeof name === "string" && name.trim() ? name : "Trainer";
  } catch {
    return "Trainer";
  }
}

function getGreeting(hour: number) {
  if (hour >= 4 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 15) return "Good afternoon";
  if (hour >= 15 && hour < 19) return "Good evening";
  return "Welcome back";
}

export default function GlobalHeader({ date }: { date: string }) {
  const [trainerName, setTrainerName] = useState("Trainer");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    // JWT data is used only for display; authorization remains server-owned.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrainerName(getTrainerName());
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 min-[761px]:px-6 min-[1001px]:px-14">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-muted">
          {greeting}, {trainerName}
        </p>
        <p className="truncate text-base font-medium text-foreground">{date}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={trainerName} />
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-foreground">
              {trainerName}
            </p>
            <p className="text-xs text-muted">Trainer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
