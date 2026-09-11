import BackLink from "@/components/BackLink";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
type ProgressPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientProgressPage({
  params,
}: ProgressPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl">
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader title="Client Progress" />

      <p className="mb-5 text-sm text-muted">Client ID: {id}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-4">
          <StatusBadge status="Completed" />
          <p className="mt-3 text-[32px] leading-none font-bold tabular-nums">8</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <StatusBadge status="Pending" />
          <p className="mt-3 text-[32px] leading-none font-bold tabular-nums">3</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <StatusBadge status="Skipped" />
          <p className="mt-3 text-[32px] leading-none font-bold tabular-nums">2</p>
        </div>
      </div>
    </div>
  );
}
