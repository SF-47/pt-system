"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Search, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import PlanCard, { PlanCardSkeleton } from "@/components/PlanCard";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";
import type { PagedResponse } from "@/types/api";

type WorkoutPlan = {
  id: number;
  name: string;
  description: string;
  exercises: unknown[];
};

type WorkoutStats = {
  totalPlans: number;
  totalAssignments: number;
};

export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [listError, setListError] = useState("");
  const [statsError, setStatsError] = useState("");
  const pageSize = 10;

  useEffect(() => {
    let ignore = false;

    async function getAllWorkoutPlans() {
      setIsFetching(true);
      setListError("");
      try {
        const response = await api.get<PagedResponse<WorkoutPlan>>(
          Endpoints.workoutPlans(page, pageSize),
        );
        if (ignore) return;
        setWorkoutPlans(response.data.items);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch {
        if (!ignore) setListError("Workout plans could not be loaded. Please try again.");
      } finally {
        if (!ignore) setIsFetching(false);
      }
    }

    void getAllWorkoutPlans();
    return () => { ignore = true; };
  }, [page]);

  useEffect(() => {
    let ignore = false;

    async function getWorkoutStats() {
      try {
        const response = await api.get<WorkoutStats>(Endpoints.workoutPlansStats);
        if (!ignore) setStats(response.data);
      } catch {
        if (!ignore) setStatsError("Workout plan totals are currently unavailable.");
      }
    }

    void getWorkoutStats();
    return () => { ignore = true; };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPlans = workoutPlans.filter((plan) =>
    plan.name.toLowerCase().includes(normalizedSearch) ||
    plan.description?.toLowerCase().includes(normalizedSearch),
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">Workout Plans</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted">Create, assign, and organize workout routines for your clients.</p>
        </div>
        <Link href="/workout-plans/new" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-hover">
          <span className="text-sm font-bold leading-none" aria-hidden="true">+</span>
          <span>Create Workout Plan</span>
        </Link>
      </div>

      <section aria-label="Workout plan summary" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-muted uppercase">Workout plans</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">{stats?.totalPlans ?? "—"} Plans</p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft"><Dumbbell className="size-5 text-primary" strokeWidth={2.2} /></div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-muted uppercase">Total assignments</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">{stats?.totalAssignments ?? "—"} Assignments</p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft"><Users className="size-5 text-primary" strokeWidth={2} /></div>
        </div>
      </section>

      {statsError && <p className="mb-4 text-sm text-warning" role="status">{statsError}</p>}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="w-full max-w-sm">
          <label htmlFor="workout-search" className="mb-1 block text-sm font-medium text-foreground">Search this page</label>
          <div className="flex items-center gap-2.5 rounded-lg border border-input-border bg-surface px-3.5 py-2 shadow-xs">
            <Search className="size-4 shrink-0 text-muted" />
            <input id="workout-search" type="search" placeholder="Workout plan name" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="min-h-0 w-full border-0 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none" />
          </div>
        </div>
        <p className="text-xs font-medium text-muted sm:text-sm">{filteredPlans.length} visible on this page · {totalCount} total</p>
      </div>

      {listError ? (
        <div className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">{listError}</div>
      ) : isFetching ? (
        <div aria-busy="true" aria-label="Loading workout plans" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((placeholder) => <PlanCardSkeleton key={placeholder} />)}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => <PlanCard key={plan.id} id={plan.id} name={plan.name} description={plan.description} count={plan.exercises?.length || 0} kind="workout" />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-xs"><EmptyState icon="workout" title="No workout plans found" description={searchTerm.trim() ? "No plans on this page match your search." : "Create a plan to start your workout library."} /></div>
      )}

      <div className="mt-8 border-t border-border pt-4">
        <Pagination page={page} totalPages={totalPages} isLoading={isFetching} onPrevious={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(totalPages, current + 1))} />
      </div>
    </div>
  );
}
