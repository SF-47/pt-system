import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import { payments } from "@/data/mock-data";

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payments"
        description="Payment updates are not available yet."
      />

      <div
        className="w-full overflow-x-auto rounded-md border border-border-strong bg-surface dark:border-[#3A4149] dark:bg-[#1B1F24]"
        role="region"
        aria-label="Payments table"
        tabIndex={0}
      >
        <table className="w-full border-collapse whitespace-nowrap tabular-nums">
          <thead>
            <tr>
              {['Client', 'Amount', 'Due Date', 'Status', 'Action'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="bg-[#f3f7f4] px-4 py-3.5 text-left align-middle font-semibold dark:bg-[#20252A]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t border-border-strong transition-colors hover:bg-hover focus-within:bg-hover dark:border-[#3A4149] dark:hover:bg-[#23292F] dark:focus-within:bg-[#23292F]"
              >
                <td className="px-4 py-3.5 align-middle">{payment.clientName}</td>
                <td className="px-4 py-3.5 align-middle">${payment.amount}</td>
                <td className="px-4 py-3.5 align-middle">{payment.dueDate}</td>
                <td className="px-4 py-3.5 align-middle">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-4 py-3.5 align-middle">
                  {payment.status === "Pending" ? (
                    <button
                      className="inline-flex min-h-9 cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-[7px] text-[13px] font-semibold text-muted"
                      disabled
                    >
                      <Icon name="check" className="size-4" />
                      Mark Paid
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
