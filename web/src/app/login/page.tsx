"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Temporary frontend-only behavior
    console.log({
      email,
      password,
    });

    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 dark:bg-[#0F1115]">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 dark:border-[#2C3238] dark:bg-[#1B1F24] min-[601px]:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary dark:text-[#86D5A9]">
            PT System
          </p>

          <h1 className="mt-2 text-[30px] font-bold text-foreground dark:text-[#F3F4F6]">
            Trainer Login
          </h1>

          <p className="mt-2 text-sm text-muted dark:text-[#9CA3AF]">
            Sign in to manage your clients, workouts, meals, and payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground dark:text-[#D1D5DB]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="trainer@example.com"
              className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft dark:border-[#4B5563] dark:bg-[#1B1F24] dark:text-[#F3F4F6] dark:placeholder:text-[#6B7280] dark:focus:ring-[#173D2A]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground dark:text-[#D1D5DB]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft dark:border-[#4B5563] dark:bg-[#1B1F24] dark:text-[#F3F4F6] dark:placeholder:text-[#6B7280] dark:focus:ring-[#173D2A]"
            />
          </div>

          <button
            type="submit"
            className="min-h-11 w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted dark:text-[#9CA3AF]">
          Authentication will be connected to the ASP.NET backend later.
        </p>
      </div>
    </main>
  );
}
