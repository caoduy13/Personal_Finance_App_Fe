import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { profitLossChartData } from "../mockData";
import { useFinanceDashboard } from "../context/FinanceDashboardContext";

export function ProfitLossChart() {
  const { formatMonth, language } = useFinanceDashboard();

  const data = profitLossChartData.map((d, i) => ({
    ...d,
    label: formatMonth(d.month),
    index: i,
  }));

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 10 }}
            interval={language === "vi" ? 1 : 2}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            fill="url(#inflowGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
