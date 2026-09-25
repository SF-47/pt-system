"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClientGrowthChart, {
  type ClientGrowthPoint,
} from "@/components/ClientGrowthChart";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import PaymentStatusChart, {
  type PaymentStats,
} from "@/components/PaymentStatusChart";
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
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [isPaymentStatsLoading, setIsPaymentStatsLoading] = useState(true);
  const [paymentStatsError, setPaymentStatsError] = useState("");
  const [clientGrowth, setClientGrowth] = useState<ClientGrowthPoint[]>([]);
  const [isClientGrowthLoading, setIsClientGrowthLoading] = useState(true);
  const [clientGrowthError, setClientGrowthError] = useState("");

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

  useEffect(() => {
    let ignore = false;

    async function getPaymentStats() {
      try {
        const response = await api.get<PaymentStats>(Endpoints.paymentsStats);
        if (!ignore) setPaymentStats(response.data);
      } catch {
        if (!ignore) {
          setPaymentStatsError("Payment status could not be loaded.");
        }
      } finally {
        if (!ignore) setIsPaymentStatsLoading(false);
      }
    }

    void getPaymentStats();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function getClientGrowth() {
      try {
        const response = await api.get<ClientGrowthPoint[]>(
          Endpoints.clientGrowth,
        );
        if (!ignore) setClientGrowth(response.data);
      } catch {
        if (!ignore) {
          setClientGrowthError("Client growth could not be loaded.");
        }
      } finally {
        if (!ignore) setIsClientGrowthLoading(false);
      }
    }

    void getClientGrowth();
    return () => { ignore = true; };
  }, []);

  if (isLoading) return <DashboardLoading />;

  return (
    <div className="[&>header]:mb-4">
      <PageHeader title="Dashboard" description="Manage your clients, plans, and pending payments.">
        <Link href="/clients/new" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-hover">
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>

      {error && <div className="mb-5 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">{error}</div>}

      <section className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard summary">
        <SummaryMetric label="Clients" value={stats?.totalClients ?? "—"} />
        <SummaryMetric label="Workout plans" value={stats?.totalWorkoutPlans ?? "—"} />
        <SummaryMetric label="Meal plans" value={stats?.totalMealPlans ?? "—"} />
        <SummaryMetric label="Pending payments" value={stats?.pendingPayments ?? "—"} />
      </section>

      <section
        aria-label="Dashboard analytics"
        className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]"
      >
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Client Growth</h2>
          <p className="mt-1 text-sm text-muted">Total clients over time.</p>
          {isClientGrowthLoading ? (
            <div
              className="mt-3 h-48 animate-pulse rounded-lg bg-background"
              aria-label="Loading client growth"
              aria-busy="true"
            />
          ) : clientGrowthError ? (
            <p className="mt-4 text-sm text-muted" role="status">
              {clientGrowthError}
            </p>
          ) : clientGrowth.length === 0 ? (
            <div className="mt-3 grid h-48 place-items-center rounded-lg border border-dashed border-border bg-background p-6 text-center">
              <p className="text-sm text-muted">No client growth data yet.</p>
            </div>
          ) : (
            <div className="mt-1">
              <ClientGrowthChart points={clientGrowth} />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Payment Status</h2>
          <p className="mt-1 text-sm text-muted">
            Paid and pending payments.
          </p>

          {isPaymentStatsLoading ? (
            <div
              className="mt-3 h-48 animate-pulse rounded-lg bg-background"
              aria-label="Loading payment status"
              aria-busy="true"
            />
          ) : paymentStatsError ? (
            <p className="mt-4 text-sm text-muted" role="status">
              {paymentStatsError}
            </p>
          ) : paymentStats ? (
            <div className="mt-1">
              <PaymentStatusChart stats={paymentStats} />
            </div>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="start-title" className="mt-4 rounded-xl bg-primary-soft p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="start-title" className="text-xl font-semibold">Plan their next session</h2>
            <p className="mt-1 text-sm leading-relaxed">Build a workout or meal plan you can reuse with your clients.</p>
          </div>
          <Icon name="workout" className="size-8 shrink-0 text-primary dark:text-foreground" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/workout-plans/new" className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            Create Workout Plan
            <Icon name="arrow" className="size-4 text-primary dark:text-foreground" />
          </Link>
          <Link href="/meal-plans/new" className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            Create Meal Plan
            <Icon name="arrow" className="size-4 text-primary dark:text-foreground" />
          </Link>
          <Link href="/payments?add=1" className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            New Payment
            <Icon name="plus" className="size-4 text-primary dark:text-foreground" />
          </Link>
          <Link href="/payments?status=Pending" className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg bg-surface px-4 font-semibold hover:bg-hover">
            Pending Payments{stats ? ` (${stats.pendingPayments})` : ""}
            <Icon name="arrow" className="size-4 text-primary dark:text-foreground" />
          </Link>
        </div>
      </section>
    </div>
  );
}
