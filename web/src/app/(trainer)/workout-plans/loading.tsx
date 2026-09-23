import { PlanCardSkeleton } from "@/components/PlanCard";

export default function Loading() {
  return (
    <div aria-label="Loading workout plans" aria-busy="true" className="animate-pulse">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-52 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-44 rounded-lg bg-border" />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="min-h-28 rounded-xl border border-border bg-surface px-5 py-4">
            <div className="h-3 w-28 rounded bg-border" />
            <div className="mt-3 h-7 w-36 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-sm">
          <div className="mb-2 h-4 w-36 rounded bg-border" />
          <div className="h-12 w-full rounded-md bg-border" />
        </div>
        <div className="h-4 w-48 rounded bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <PlanCardSkeleton key={card} />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between py-4">
        <div className="h-11 w-24 rounded-md bg-border" />
        <div className="h-4 w-24 rounded bg-border" />
        <div className="h-11 w-20 rounded-md bg-border" />
      </div>
    </div>
  );
}
