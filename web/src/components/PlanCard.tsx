import Link from "next/link";
import Icon from "@/components/Icon";
import { Zap, ArrowRight } from "lucide-react";

type PlanCardProps = {
  id: number;
  name: string;
  description: string;
  count: number;
  kind: "workout" | "meal";
};

export default function PlanCard({ id, name, description, count, kind }: PlanCardProps) {
  const countLabel = `${count} ${kind === "workout" ? "exercises" : "meals"}`;

  if (kind === "workout") {
    return (
      <article className="flex min-h-[220px] min-w-0 flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all hover:border-primary">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-lg leading-snug font-bold tracking-tight text-foreground wrap-anywhere">
              {name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/20 bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-hover dark:text-foreground">
              <Zap className="size-3 fill-current text-primary dark:text-foreground" />
              {countLabel}
            </span>
          </div>
          <p
            className="mt-3.5 mb-6 min-h-[44px] line-clamp-3 text-sm leading-relaxed text-muted wrap-anywhere"
            title={description}
          >
            {description}
          </p>
        </div>
        <Link
          href={`/workout-plans/${id}`}
          aria-label={`View ${name}`}
          className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-soft px-4 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary hover:text-white dark:text-foreground"
        >
          View Plan <ArrowRight className="size-4" />
        </Link>
      </article>
    );
  }

  return (
    <article className="flex min-h-[220px] min-w-0 flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-lg leading-snug font-semibold tracking-tight wrap-anywhere">{name}</h3>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-hover dark:text-foreground">
          <Icon name="meal" className="size-3.5" />{countLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        <p className="mt-2 mb-5 line-clamp-3 min-h-[63px] text-sm leading-[21px] text-muted wrap-anywhere" title={description}>{description}</p>
        <Link href={`/meal-plans/${id}`} aria-label={`View ${name}`} className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary-soft px-4 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary hover:text-white dark:text-foreground">
          View Plan <Icon name="arrow" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function PlanCardSkeleton({ kind = "workout" }: { kind?: "workout" | "meal" }) {
  if (kind === "workout") {
    return (
      <div aria-hidden="true" className="flex min-h-[220px] animate-pulse flex-col justify-between rounded-2xl border border-border bg-surface p-6">
        <div className="flex justify-between items-start gap-3">
          <div className="h-6 w-1/2 rounded bg-border/60" />
          <div className="h-6 w-24 rounded-md bg-primary-soft" />
        </div>
        <div className="mt-4 mb-6 min-h-[44px] space-y-2">
          <div className="h-4 w-full rounded bg-border/40" />
          <div className="h-4 w-2/3 rounded bg-border/40" />
        </div>
        <div className="h-10 w-full rounded-lg bg-primary-soft" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="flex min-h-[220px] animate-pulse flex-col rounded-lg border border-border bg-surface p-5">
      <div className="flex justify-between gap-3"><div className="h-6 w-1/2 rounded bg-border" /><div className="h-6 w-20 rounded bg-border" /></div>
      <div className="mt-4 min-h-[72px]"><div className="h-4 w-full rounded bg-border" /><div className="mt-2 h-4 w-2/3 rounded bg-border" /></div>
      <div className="mt-auto h-11 rounded bg-primary-soft" />
    </div>
  );
}
