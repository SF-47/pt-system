"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type PaymentStats = {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
};

type PaymentStatusChartProps = {
  stats: PaymentStats;
};

const colors = ["var(--primary)", "var(--warning)"];

export default function PaymentStatusChart({
  stats,
}: PaymentStatusChartProps) {
  const total = stats.paidPayments + stats.pendingPayments;
  const getPercentage = (count: number) =>
    total === 0 ? "0%" : `${((count / total) * 100).toFixed(1)}%`;
  const data = [
    {
      name: "Paid",
      count: stats.paidPayments,
      percentage: getPercentage(stats.paidPayments),
    },
    {
      name: "Pending",
      count: stats.pendingPayments,
      percentage: getPercentage(stats.pendingPayments),
    },
  ];

  return (
    <div
      role="img"
      aria-label={`Payment status: ${total} total, ${data[0].count} paid (${data[0].percentage}), ${data[1].count} pending (${data[1].percentage})`}
    >
      <div className="relative h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={62}
              paddingAngle={2}
              stroke="var(--surface)"
              strokeWidth={2}
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
              }}
              formatter={(value) => `${Number(value)} payments`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-2xl leading-none font-semibold tabular-nums">
            {total}
          </strong>
          <span className="mt-1 text-xs text-muted">Total</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-2">
        {data.map((item, index) => (
          <div key={item.name} className="min-w-0">
            <dt className="flex items-center gap-2 text-sm text-muted">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index] }}
                aria-hidden="true"
              />
              {item.name}
            </dt>
            <dd className="mt-0.5 flex items-baseline gap-2 tabular-nums">
              <span className="text-lg font-semibold">{item.count}</span>
              <span className="text-xs text-muted">{item.percentage}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
