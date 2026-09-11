import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

import { clients } from "@/data/mock-data";

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${clients.length} clients in your sample roster. Manage contact details and subscriptions.`}
      >
        <Link
          href="/clients/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Icon name="plus" />
          Add Client
        </Link>
      </PageHeader>

      <div
        className="w-full overflow-x-auto rounded-md border border-border bg-surface dark:border-[#2C3238] dark:bg-[#1B1F24]"
        role="region"
        aria-label="Clients table"
        tabIndex={0}
      >
        <table className="w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              <th
                scope="col"
                className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
              >
                Client
              </th>
              <th
                scope="col"
                className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
              >
                Phone
              </th>
              <th
                scope="col"
                className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
              >
                Payment
              </th>
              <th
                scope="col"
                className="bg-[#f3f7f4] px-4 py-3 text-left align-middle text-sm font-semibold text-muted dark:bg-[#20252A]"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-t border-border transition-colors hover:bg-hover focus-within:bg-hover dark:border-[#2C3238] dark:hover:bg-[#23292F] dark:focus-within:bg-[#23292F]"
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <Avatar name={client.fullName} />
                    <div>
                      <strong>{client.fullName}</strong>
                      <span className="mt-1 block text-xs text-muted">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle">
                  {client.phoneNumber}
                </td>

                <td className="px-4 py-3 align-middle">
                  <StatusBadge status={client.paymentStatus} />
                </td>

                <td className="px-4 py-3 align-middle">
                  <div className="flex gap-2">
                    <Link
                      className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-hover"
                      href={`/clients/${client.id}`}
                      aria-label={`View ${client.fullName}`}
                    >
                      <Icon name="view" />
                      View
                    </Link>
                    <Link
                      className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-hover"
                      href={`/clients/${client.id}/edit`}
                      aria-label={`Edit ${client.fullName}`}
                    >
                      <Icon name="edit" />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
