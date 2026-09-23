"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span
            className="mx-auto grid size-11 place-items-center rounded-lg bg-primary text-sm font-bold tracking-tight text-white"
            aria-hidden="true"
          >
            PT
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-base font-medium text-foreground"
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
              className="login-input w-full rounded-md border border-input-border bg-surface px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-base font-medium text-foreground"
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
              className="login-input w-full rounded-md border border-input-border bg-surface px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-base text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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

        <p className="mt-12 text-center text-base text-muted">
          Need an account?{" "}
          <span className="font-medium text-foreground">
            Contact your administrator
          </span>
        </p>
      </div>
    </main>
  );
}
