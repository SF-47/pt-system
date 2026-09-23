"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ClientGrowthPoint = {
  period: string;
  count: number;
};

type ClientGrowthChartProps = {
  points: ClientGrowthPoint[];
};

function formatPeriod(period: string, includeYear: boolean) {
  const [year, month, day] = period.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: includeYear ? "numeric" : undefined,
  }).format(date);
}

export default function ClientGrowthChart({
  points,
}: ClientGrowthChartProps) {
  const data = points.map((point) => ({
    ...point,
    label: formatPeriod(point.period, false),
    fullLabel: formatPeriod(point.period, true),
  }));
  const tickInterval = Math.max(0, Math.ceil(points.length / 7) - 1);

  return (
    <div className="h-48 w-full" role="img" aria-label="Cumulative client growth by day">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tickCount={5}
            width={28}
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text)",
            }}
            labelFormatter={(_label, payload) =>
              payload[0]?.payload.fullLabel ?? ""
            }
            formatter={(value) => [`${Number(value)} clients`, "Total"]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
