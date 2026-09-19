"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import DashboardLoading from "./loading";

type DashboardStats = {
  totalClients: number;
  activeClients: number;
  totalWorkoutPlans: number;
  totalMealPlans: number;
  pendingWorkoutAssignments: number;
  pendingMealStatuses: number;
  pendingPayments: number;
  pendingPaymentAmount: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function getDashboardStats() {
      try {
        const response = await api.get<DashboardStats>(Endpoints.dashboardStats);
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setError("Dashboard totals could not be loaded. Please try again.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void getDashboardStats();
    return () => { ignore = true; };
  }, []);

  if (isLoading) return <DashboardLoading />;

  return (
    <div>
      <PageHeader title="Dashboard" description="Manage your clients, plans, and pending payments.">
        <Link href="/clients/new" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-hover">
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>

      {error && <div className="mb-5 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">{error}</div>}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard summary">
        <SummaryMetric label="Clients" value={stats?.totalClients ?? "—"} />
        <SummaryMetric label="Workout plans" value={stats?.totalWorkoutPlans ?? "—"} />
        <SummaryMetric label="Meal plans" value={stats?.totalMealPlans ?? "—"} />
        <SummaryMetric label="Pending payments" value={stats?.pendingPayments ?? "—"} />
      </section>

      <section aria-labelledby="start-title" className="rounded-xl bg-primary-soft p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="start-title" className="text-xl font-semibold">Plan their next session</h2>
            <p className="mt-2 leading-relaxed">Build a workout or meal plan you can reuse with your clients.</p>
          </div>
          <Icon name="workout" className="size-10 shrink-0 text-primary dark:text-foreground" />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href="/workout-plans/new" className="inline-flex min-h-12 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            Create Workout Plan
            <Icon name="arrow" className="size-4 text-primary dark:text-foreground" />
          </Link>
          <Link href="/meal-plans/new" className="inline-flex min-h-12 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            Create Meal Plan
            <Icon name="arrow" className="size-4 text-primary dark:text-foreground" />
          </Link>
        </div>
      </section>
    </div>
  );
}
