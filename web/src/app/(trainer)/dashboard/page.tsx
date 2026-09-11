import Link from "next/link";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { clients, payments } from "@/data/mock-data";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(new Date());
  const attentionClients = clients.filter(
    (client) => client.paymentStatus === "Pending",
  );
  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending",
  );

  return (
    <div>
      <PageHeader
        title={today}
        eyebrow="Welcome back, Trainer"
        description="A clear view of your clients, training, and nutrition."
        compact
      >
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
          href="/clients/new"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>
      <div className="grid grid-cols-1 gap-3 min-[601px]:grid-cols-2 min-[1001px]:grid-cols-5">
        <StatCard
          title="Total Clients"
          value={24}
          supportingText="18 paid clients"
          variant="primary"
          className="w-full min-[1001px]:col-span-2"
        />
        <StatCard
          title="Pending Payments"
          value={6}
          className="w-full"
        />
        <StatCard
          title="Workouts Completed Today"
          value={12}
          className="w-full"
        />
        <StatCard
          title="Meals Completed Today"
          value={20}
          className="w-full"
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 min-[1001px]:mt-4 min-[1001px]:grid-cols-[3fr_2fr] min-[1001px]:gap-4">
        <section className="rounded-lg border border-border bg-surface p-5 dark:border-[#2C3238] dark:bg-[#1B1F24]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Today’s Activity</h2>
            <Icon name="clock" className="text-muted" />
          </div>
          <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 py-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Icon name="workout" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Workouts</h3>
              <p className="mt-1 text-xs text-muted">
                12 completed · 4 pending
              </p>
            </div>
            <strong className="text-[13px] tabular-nums">12 / 16</strong>
            <progress
              value={12}
              max={16}
              aria-label="12 of 16 workouts completed"
              className="col-[2/-1] h-1.25 w-full appearance-none overflow-hidden rounded-[3px] bg-border text-primary [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-primary"
            />
          </div>
          <div className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 border-t border-border py-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-warning-soft text-warning">
              <Icon name="meal" />
            </span>
            <div>
              <h3 className="text-base font-semibold">Meals</h3>
              <p className="mt-1 text-xs text-muted">
                20 completed · 5 pending
              </p>
            </div>
            <strong className="text-[13px] tabular-nums">20 / 25</strong>
            <progress
              value={20}
              max={25}
              aria-label="20 of 25 meals completed"
              className="col-[2/-1] h-1.25 w-full appearance-none overflow-hidden rounded-[3px] bg-border text-primary [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-border [&::-webkit-progress-value]:bg-primary"
            />
          </div>
        </section>
        <section className="px-1 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Clients Needing Attention</h2>
            <Icon name="clients" className="text-muted" />
          </div>
          {attentionClients.map((client) => (
            <div
              className="flex items-center gap-3 border-y border-border py-4.5"
              key={client.id}
            >
              <Avatar name={client.fullName} />
              <div className="flex-1">
                <strong>{client.fullName}</strong>
                <p className="mt-1 text-xs text-muted">Payment pending</p>
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-semibold text-foreground transition-colors hover:bg-hover"
                href={`/clients/${client.id}`}
                aria-label={`View ${client.fullName}`}
              >
                View
                <Icon name="arrow" />
              </Link>
            </div>
          ))}
          <Link
            className="inline-flex min-h-11 items-center gap-2 font-semibold transition-colors hover:text-muted"
            href="/clients"
          >
            View all clients
            <Icon name="arrow" />
          </Link>
        </section>
        <section className="col-span-full pb-3">
          <div className="mb-3 flex items-center justify-between gap-3 max-[400px]:flex-wrap">
            <h2 className="text-lg font-semibold">Pending Payments</h2>
            <Link
              className="inline-flex min-h-11 items-center gap-2 font-semibold transition-colors hover:text-muted"
              href="/payments"
            >
              Payment register
              <Icon name="arrow" />
            </Link>
          </div>
          {pendingPayments.map((payment) => (
            <div
              className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-surface px-5 py-4 dark:border-[#2C3238] dark:bg-[#1B1F24]"
              key={payment.id}
            >
              <Icon name="payment" className="text-warning" />
              <strong>{payment.clientName}</strong>
              <span className="text-muted min-[401px]:ml-auto">
                Due {payment.dueDate}
              </span>
              <strong>${payment.amount}</strong>
              <StatusBadge status={payment.status} />
            </div>
          ))}
        </section>
      </div>
      <p className="my-4 text-[13px] text-muted">
        Sample data: overview totals are separate from the client and payment
        records shown below.
      </p>
    </div>
  );
}
