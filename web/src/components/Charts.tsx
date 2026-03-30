"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface ScorecardItem {
  state: string;
  composite_rank: number;
  volume_rank: number;
  composite_score: number;
  volume_2024_m: number;
  cagr_3yr: number;
  rank_delta: number;
}

interface TrendItem {
  year: number;
  total_billions: number;
}

interface USOriginItem {
  state: string;
  volume_2024_m: number;
  cagr_3yr: number;
}

interface Top5Item {
  state: string;
  yearly_data: { year: number; volume_m: number }[];
}

function NationalTrend({ data }: { data: TrendItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${v}B`} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <Bar dataKey="total_billions" fill="#0666eb" radius={[4, 4, 0, 0]} name="Total (USD Billions)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RankComparison({ data }: { data: ScorecardItem[] }) {
  const chartData = data.map((d) => ({
    state: d.state.length > 15 ? d.state.slice(0, 13) + "..." : d.state,
    "Volume Rank": d.volume_rank,
    "Opportunity Rank": d.composite_rank,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
          <YAxis
            reversed
            tick={{ fontSize: 12 }}
            label={{ value: "Rank (lower is better)", angle: -90, position: "insideLeft", offset: -5, style: { fontSize: 12, fill: "#9ca3af" } }}
          />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <Legend verticalAlign="top" />
          <Bar dataKey="Volume Rank" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Opportunity Rank" fill="#0666eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GrowthTrajectory({ data }: { data: Top5Item[] }) {
  const colors = ["#0666eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const years = new Set<number>();
  data.forEach((s) => s.yearly_data.forEach((d) => years.add(d.year)));

  const chartData = Array.from(years)
    .filter((y) => y >= 2015 && y <= 2024)
    .sort()
    .map((year) => {
      const row: Record<string, number> = { year };
      data.forEach((s) => {
        const point = s.yearly_data.find((d) => d.year === year);
        if (point) row[s.state] = Math.round(point.volume_m);
      });
      return row;
    });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${v}M`} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <Legend verticalAlign="top" />
          {data.map((s, i) => (
            <Line
              key={s.state}
              type="monotone"
              dataKey={s.state}
              stroke={colors[i]}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function USOrigin({ data }: { data: USOriginItem[] }) {
  const chartData = data.slice(0, 10).map((d) => ({
    state: d.state,
    volume: Math.round(d.volume_2024_m),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 80, bottom: 5, left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}B`} />
          <YAxis type="category" dataKey="state" tick={{ fontSize: 12 }} width={110} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <Bar dataKey="volume" fill="#0666eb" radius={[0, 4, 4, 0]} name="Volume 2024 (USD M)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const Charts = {
  NationalTrend,
  RankComparison,
  GrowthTrajectory,
  USOrigin,
};
