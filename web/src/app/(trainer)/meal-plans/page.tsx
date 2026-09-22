"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import PlanCard, { PlanCardSkeleton } from "@/components/PlanCard";
import SummaryMetric from "@/components/SummaryMetric";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import type { PagedResponse } from "@/types/api";
import MealPlansLoading from "./loading";

type MealPlan = {
  id: number;
  name: string;
  description: string;
  meals: unknown[];
};

type MealStats = {
  totalPlans: number;
  totalAssignments: number;
};

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<MealStats | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listError, setListError] = useState("");
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function getMealPlans() {
      setIsFetching(true);
      setListError("");
      try {
        const response = await api.get<PagedResponse<MealPlan>>(
          Endpoints.mealPlans(page, pageSize),
        );
        if (ignore) return;
        setMealPlans(response.data.items);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
      } catch {
        if (!ignore) setListError("Meal plans could not be loaded. Please try again.");
      } finally {
        if (!ignore) {
          setIsFetching(false);
          setIsInitialLoading(false);
        }
      }
    }

    void getMealPlans();
    return () => { ignore = true; };
  }, [page]);

  useEffect(() => {
    let ignore = false;

    async function getMealStats() {
      try {
        const response = await api.get<MealStats>(Endpoints.mealPlansStats);
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setStatsError("Meal plan totals are currently unavailable.");
      }
    }

    void getMealStats();
    return () => { ignore = true; };
  }, []);

  if (isInitialLoading) return <MealPlansLoading />;

  return (
    <div className="[&>header_h1]:text-[28px] [&>header_p]:text-sm [&>header_p]:leading-relaxed">
      <PageHeader title="Meal Plans" description="Reusable meal plans with clear instructions for daily nutrition.">
        <Link href="/meal-plans/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover">
          <Icon name="plus" />
          Create Meal Plan
        </Link>
      </PageHeader>

      <section aria-label="Meal plan summary" className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryMetric compact label="Meal plans" value={stats?.totalPlans ?? "—"} />
        <SummaryMetric compact label="Total assigned plans" value={stats?.totalAssignments ?? "—"} />
      </section>

      {statsError && <p className="mb-4 text-sm text-warning" role="status">{statsError}</p>}

      <section
        className="mb-5 rounded-lg border border-border bg-surface p-4"
        aria-label="Meal plan tools"
      >
        <div className="min-w-0 max-w-sm">
          <label
            htmlFor="meal-plan-search"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Search meal plans
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="meal-plan-search"
              type="search"
              placeholder="Plan name or description"
              className="min-h-11 w-full rounded-md border border-input-border bg-background py-2 pr-3 pl-10 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <h2 className="text-sm font-semibold">Meal plan library</h2>
        <p className="text-sm text-muted">{totalCount} meal plans</p>
      </div>

      {listError ? (
        <div className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">{listError}</div>
      ) : isFetching ? (
        <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3" aria-label="Loading meal plans" aria-busy="true">
          {Array.from({ length: 6 }).map((_, index) => <PlanCardSkeleton key={index} kind="meal" />)}
        </div>
      ) : mealPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3">
          {mealPlans.map((plan) => <PlanCard key={plan.id} id={plan.id} name={plan.name} description={plan.description} count={plan.meals.length} kind="meal" />)}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface"><EmptyState icon="meal" title="No meal plans found" description="Create a meal plan to start your library." /></div>
      )}

      <Pagination page={page} totalPages={totalPages} isLoading={isFetching} onPrevious={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(totalPages, current + 1))} />
    </div>
  );
}
