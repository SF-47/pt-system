import Link from "next/link";

import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import { currencyFormatter, formatDate } from "@/lib/format";
import type { Client, Payment } from "./types";

type ClientSummaryCardProps = {
  client: Client;
  payment: Payment | null;
  onDeleteClick: () => void;
};

export default function ClientSummaryCard({
  client,
  payment,
  onDeleteClick,
}: ClientSummaryCardProps) {
  return (
    <div className="mb-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="flex min-w-0 items-center gap-4 [&>span]:size-14 [&>span]:text-lg sm:[&>span]:size-16">
          <Avatar name={client.fullName} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold wrap-anywhere sm:text-2xl">
                {client.fullName}
              </h1>
              <StatusBadge status={client.isActive ? "Active" : "Inactive"} />
            </div>
            <p className="mt-1 text-sm text-muted wrap-anywhere">
              {client.email ?? "No email provided"}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm lg:grid-cols-1 lg:border-x lg:border-border lg:px-5">
          <div>
            <dt className="text-xs text-muted">Username</dt>
            <dd className="mt-0.5 font-medium wrap-anywhere">
              {client.username}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Phone</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {client.phoneNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Client since</dt>
            <dd className="mt-0.5 font-medium">
              {formatDate(client.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="w-full">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase lg:text-right">
              Payment
            </p>

            {payment ? (
              <div className="mt-1.5 lg:text-right">
                <div className="flex items-center gap-2 lg:flex-row-reverse">
                  <StatusBadge
                    status={payment.status === 1 ? "Paid" : "Pending"}
                  />
                  <p className="text-lg font-semibold text-foreground tabular-nums">
                    {currencyFormatter.format(payment.amount)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Due {formatDate(payment.dueDate)}
                  {payment.paidAt && ` · Paid ${formatDate(payment.paidAt)}`}
                </p>
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-muted lg:text-right">
                No payment information available.
              </p>
            )}
          </div>

          <div className="flex w-full flex-wrap gap-2 border-t border-border pt-3 lg:justify-end">
            <Link
              href={`/clients/${client.id}/edit`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium transition-colors hover:bg-hover"
            >
              <Icon name="edit" className="size-4" />
              Edit Client
            </Link>
            <button
              type="button"
              onClick={onDeleteClick}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-danger/40 bg-surface px-3 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
            >
              <Icon name="close" className="size-4" />
              Delete Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
