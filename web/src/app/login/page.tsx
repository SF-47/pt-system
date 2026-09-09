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
    <main className="relative flex min-h-screen items-center justify-center bg-[#f6f8f6] px-4 dark:bg-[#0F1115]">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 dark:border-[#2C3238] dark:bg-[#1B1F24]">
        <div className="mb-8">
          <p className="text-sm font-medium text-green-700 dark:text-[#86D5A9]">PT System</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-[#F3F4F6]">
            Trainer Login
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-[#9CA3AF]">
            Sign in to manage your clients, workouts, meals, and payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#D1D5DB]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="trainer@example.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-[#4B5563] dark:bg-[#1B1F24] dark:text-[#F3F4F6] dark:placeholder:text-[#6B7280] dark:focus:ring-[#173D2A]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#D1D5DB]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-[#4B5563] dark:bg-[#1B1F24] dark:text-[#F3F4F6] dark:placeholder:text-[#6B7280] dark:focus:ring-[#173D2A]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-700 px-4 py-2.5 font-medium text-white transition hover:bg-green-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-[#9CA3AF]">
          Authentication will be connected to the ASP.NET backend later.
        </p>
      </div>
    </main>
  );
}
