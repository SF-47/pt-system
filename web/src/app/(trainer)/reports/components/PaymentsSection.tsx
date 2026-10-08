import { currencyFormatter } from "@/lib/format";

import type { PaymentSummary } from "../report-types";

export default function PaymentsSection({
  payments,
}: {
  payments: PaymentSummary;
}) {
  const items = [
    {
      label: "Total",
      value: currencyFormatter.format(payments.totalAmount),
      tone: "",
    },
    {
      label: "Paid",
      value: currencyFormatter.format(payments.paidAmount),
      tone: "text-primary-hover dark:text-primary",
    },
    {
      label: "Pending",
      value: currencyFormatter.format(payments.pendingAmount),
      tone: "text-warning",
    },
    { label: "Payments", value: String(payments.paymentsCount), tone: "" },
    {
      label: "Overdue",
      value: String(payments.overdueCount),
      tone: "text-danger",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-surface px-4 py-3 print:break-inside-avoid print:rounded-none print:py-2">
      <h2 className="text-lg font-semibold">Payments</h2>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-5 print:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              {item.label}
            </dt>
            <dd
              className={`text-xl font-semibold tabular-nums print:text-base ${item.tone}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
