import BackLink from "@/components/BackLink";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import Icon from "@/components/Icon";

type ProgressPageProps = { params: Promise<{ id: string }> };

export default async function ClientProgressPage({
  params,
}: ProgressPageProps) {
  const { id } = await params;
  return (
    <div className="max-w-5xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader
        title="Client Progress"
        description="Review workout adherence and outstanding assignments."
      >
        <Link
          href={`/clients/${id}/daily-activity`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 font-medium hover:bg-hover"
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </Link>
      </PageHeader>
      <section className="">
        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Workout completion</h2>
          <div className="mt-5 flex items-baseline gap-3">
            <strong className="text-4xl font-semibold tracking-tight tabular-nums">
              8 <span className="text-xl font-normal text-muted">/ 13</span>
            </strong>
            <span className="text-sm text-muted">assignments completed</span>
          </div>
          <progress
            value={8}
            max={13}
            aria-label="8 of 13 workout assignments completed"
            className="mt-5 h-2 w-full appearance-none overflow-hidden rounded-sm bg-border [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-primary"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              status: "Completed",
              value: 8,
              text: "Finished workout assignments",
            },
            {
              status: "Pending",
              value: 3,
              text: "Assignments awaiting completion",
            },
            {
              status: "Skipped",
              value: 2,
              text: "Assignments marked as skipped",
            },
          ].map((item) => (
            <div key={item.status} className="flex min-h-32 flex-col justify-between gap-3 rounded-lg border border-border bg-surface p-5">
              <div className="min-w-0 flex-1">
                <StatusBadge status={item.status} />
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
              <strong className="text-2xl font-semibold tabular-nums">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-4 text-sm text-muted">
        Sample completion totals. This preview does not load client progress.
      </p>
    </div>
  );
}
