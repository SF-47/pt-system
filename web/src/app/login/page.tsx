"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(Endpoints.trainerLogin, {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);
      router.push("/dashboard");
    } catch (error) {
      setError(
        getErrorMessage(error, "The username or password doesn't match."),
      );
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <ThemeToggle className="absolute top-4 right-4" />

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-white"
            aria-hidden="true"
          >
            <Icon name="workout" className="size-6" />
          </span>
          <span className="text-[22px] leading-tight font-bold tracking-tight">
            PT System
            <small className="block text-sm font-normal text-muted">
              Personal training
            </small>
          </span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 mb-5 text-sm text-muted">
            Sign in to manage your clients.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
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
                  className="min-h-11 w-full rounded-md border border-input-border bg-background py-2 pr-3 pl-10 text-sm text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="min-h-11 w-full rounded-md border border-input-border bg-background py-2 pr-3 pl-10 text-sm text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-60 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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

        <p className="mt-4 text-center text-sm text-muted">
          Trainer access only.
        </p>
      </div>
    </main>
  );
}
