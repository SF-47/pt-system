"use client";

import Icon, { type IconName } from "@/components/Icon";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/clients", label: "Clients", icon: "clients" },
  { href: "/workout-plans", label: "Workout Plans", icon: "workout" },
  { href: "/meal-plans", label: "Meal Plans", icon: "meal" },
  { href: "/payments", label: "Payments", icon: "payment" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <aside className="relative flex h-auto flex-col overflow-y-auto border-b border-border bg-sidebar dark:border-[#2C3238] dark:bg-[#15181C] min-[761px]:sticky min-[761px]:top-0 min-[761px]:h-dvh min-[761px]:border-r min-[761px]:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 min-[761px]:pt-6 min-[761px]:pb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-[21px] font-bold"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-10.5 place-items-center rounded-xl bg-primary text-white">
            <Icon name="workout" className="size-7" />
          </span>
          <span>
            PT System
            <small className="mt-1 block text-xs font-normal text-muted">
              Trainer Dashboard
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
                className={`mb-2 flex min-h-12 items-center gap-3 rounded-md border px-3 py-3 text-[15px] transition-colors ${
                  active
                    ? "border-primary-soft bg-primary-soft font-semibold text-primary dark:border-[#173D2A] dark:bg-[#173D2A] dark:text-[#86D5A9]"
                    : "border-transparent text-muted hover:bg-hover hover:text-foreground dark:text-[#9CA3AF] dark:hover:bg-[#23292F] dark:hover:text-[#F3F4F6]"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon name={icon} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-border px-5 py-4 min-[761px]:mt-auto min-[761px]:p-5">
          <div className="flex items-center gap-3">
            <Avatar name="Trainer" />
            <div className="min-w-0 flex-1">
              <strong>Trainer</strong>
              <span className="mt-1 block text-xs text-muted">
                Personal training
              </span>
            </div>
            <ThemeToggle />
          </div>
          <button
            disabled
            className="mt-3 flex min-h-11 w-full cursor-not-allowed items-center gap-3 text-left text-muted"
            title="Authentication is not connected yet"
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
