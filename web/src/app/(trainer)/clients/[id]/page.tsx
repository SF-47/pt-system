import BackLink from "@/components/BackLink";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";

import { clients } from "@/data/mock-data";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";

type ClientPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailsPage({ params }: ClientPageProps) {
  const { id } = await params;

  const client = clients.find((client) => client.id === Number(id));

  if (!client) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <div className="mb-6 flex items-start gap-3 [&>span:first-child]:size-11 [&>span:first-child]:text-[15px] min-[761px]:gap-4 min-[761px]:[&>span:first-child]:size-16 min-[761px]:[&>span:first-child]:text-xl [&>div>header]:mb-2">
        <Avatar name={client.fullName} />
        <div className="min-w-0 flex-1">
          <PageHeader title={client.fullName} description={client.email}>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
              href={`/clients/${id}/edit`}
            >
              <Icon name="edit" />
              Edit Client
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
              href={`/clients/${id}/progress`}
            >
              <Icon name="dashboard" />
              View Progress
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
              href={`/clients/${id}/daily-activity`}
            >
              <Icon name="calendar" />
              Daily Activity
            </Link>
          </PageHeader>
          <StatusBadge status={client.paymentStatus} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-5 min-[761px]:grid-cols-2 min-[1001px]:grid-cols-[2fr_3fr]">
        <section className="rounded-lg border border-border bg-surface p-5 min-[761px]:row-span-4">
          <h2 className="mb-3 text-lg font-semibold">Contact</h2>
          <dl className="grid gap-3">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="mt-0.5 break-words">{client.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-0.5 break-words">{client.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-0.5 break-words">{client.phoneNumber}</dd>
            </div>
          </dl>
        </section>
        <section className="border-b border-border px-1 py-4 min-[761px]:pt-0">
          <h2 className="mb-2 text-lg font-semibold">Payment Status</h2>
          <StatusBadge status={client.paymentStatus} />
        </section>
        <section className="border-b border-border px-1 py-4">
          <h2 className="mb-2 text-lg font-semibold">Assigned Workout Plans</h2>
          <p className="text-muted">
            Workout assignments are not available in the current data.
          </p>
        </section>
        <section className="border-b border-border px-1 py-4">
          <h2 className="mb-2 text-lg font-semibold">Assigned Meal Plans</h2>
          <p className="text-muted">
            Meal assignments are not available in the current data.
          </p>
        </section>
        <section className="px-1 py-4">
          <h2 className="mb-2 text-lg font-semibold">Progress</h2>
          <Link
            className="inline-flex min-h-11 items-center gap-2 font-semibold transition-colors hover:text-muted"
            href={`/clients/${id}/progress`}
          >
            <Icon name="dashboard" />
            View Progress
          </Link>
        </section>
      </div>
    </div>
  );
}
