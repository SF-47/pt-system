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
    <div>
      <BackLink href={`/clients/${id}`}>Back to Client Details</BackLink>
      <PageHeader title="Client Progress" />

      <p className="mb-6 text-muted">Client ID: {id}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-5">
          <StatusBadge status="Completed" />
          <p className="mb-1.5 text-[29px] leading-[1.2] font-bold tabular-nums">8</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-5">
          <StatusBadge status="Pending" />
          <p className="mb-1.5 text-[29px] leading-[1.2] font-bold tabular-nums">3</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-5">
          <StatusBadge status="Skipped" />
          <p className="mb-1.5 text-[29px] leading-[1.2] font-bold tabular-nums">2</p>
        </div>
      </div>
    </div>
  );
}
