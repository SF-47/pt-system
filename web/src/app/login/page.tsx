"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(Endpoints.trainerLogin, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      router.push("/dashboard");
    } catch {
      setError("The username or password doesn't match.");
      setIsLoading(false);
    }
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
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-foreground dark:text-[#D1D5DB]"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="Enter your username"
              autoComplete="username"
              required
              disabled={isLoading}
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
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              className="min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft dark:border-[#4B5563] dark:bg-[#1B1F24] dark:text-[#F3F4F6] dark:placeholder:text-[#6B7280] dark:focus:ring-[#173D2A]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading && (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
