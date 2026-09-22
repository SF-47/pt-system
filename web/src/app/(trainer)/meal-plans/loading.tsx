import { PlanCardSkeleton } from "@/components/PlanCard";

export default function Loading() {
  return (
    <div aria-label="Loading meal plans" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-44 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-40 rounded-md bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="min-h-24 rounded-lg border border-border bg-surface px-5 py-4">
            <div className="h-3 w-28 rounded bg-border" />
            <div className="mt-3 h-7 w-16 rounded bg-border" />
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 border-t border-border pt-5">
        <div className="h-4 w-32 rounded bg-border" />
        <div className="h-4 w-24 rounded bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1200px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <PlanCardSkeleton key={card} kind="meal" />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 py-4">
        <div className="h-11 w-24 rounded-md bg-border" />
        <div className="h-4 w-24 rounded bg-border" />
        <div className="h-11 w-20 rounded-md bg-border" />
      </div>
    </div>
  );
}
