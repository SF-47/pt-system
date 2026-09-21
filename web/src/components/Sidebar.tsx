"use client";

import Icon, { type IconName } from "@/components/Icon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/clients", label: "Clients", icon: "clients" },
  { href: "/workout-plans", label: "Workout Plans", icon: "workout" },
  { href: "/meal-plans", label: "Meal Plans", icon: "meal" },
  { href: "/payments", label: "Payments", icon: "payment" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    setOpen(false);
    router.replace("/login");
  }

  return (
    <aside className="relative flex h-auto flex-col overflow-y-auto border-b border-border bg-sidebar dark:border-border dark:bg-sidebar min-[761px]:sticky min-[761px]:top-0 min-[761px]:h-dvh min-[761px]:border-r min-[761px]:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 min-[761px]:pt-7 min-[761px]:pb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-[22px] font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
            <Icon name="workout" className="size-7" />
          </span>
          <span>
            PT System
            <small className="mt-1 block text-sm font-normal text-muted">
              Personal training
            </small>
          </span>
        </Link>
        <button
          className="inline-flex min-h-11 items-center rounded-sm border border-border px-3 py-2 min-[761px]:hidden"
          aria-expanded={open}
          aria-controls="trainer-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close menu" : "Menu"}
        </button>
      </div>
      <div
        id="trainer-navigation"
        className={`${open ? "flex" : "hidden"} flex-1 flex-col min-[761px]:flex`}
      >
        <nav className="px-4 pt-2 min-[761px]:pt-0" aria-label="Trainer navigation">
          {items.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`mb-2 flex min-h-13 items-center gap-3.5 rounded-lg border px-3 py-3 text-[17px] transition-colors ${
                  active
                    ? "border-transparent bg-primary font-semibold text-white dark:border-transparent dark:bg-primary dark:text-white"
                    : "border-transparent text-foreground hover:bg-hover hover:text-foreground dark:text-foreground dark:hover:bg-hover dark:hover:text-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon name={icon} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 px-4 py-4 min-[761px]:mt-auto min-[761px]:p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-muted transition-colors hover:bg-hover hover:text-foreground"
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
