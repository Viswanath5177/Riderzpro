import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--popover-foreground)",
  },
};

export function AreaTrend({
  data,
  k = "value",
}: {
  data: { name: string; [k: string]: number | string }[];
  k?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip {...tip} />
        <Area
          type="monotone"
          dataKey={k}
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#ga)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Bars({
  data,
  k = "value",
}: {
  data: { name: string; [k: string]: number | string }[];
  k?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey={k} fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const series = (vals: number[]) => vals.map((value, i) => ({ name: week[i % 7], value }));
