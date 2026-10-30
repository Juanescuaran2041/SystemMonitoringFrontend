import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SERVICE_COLORS, SERVICE_IDS } from "../../constants";

const AXIS_COLOR = "#64748b";

/**
 * Response time of the last calls of each service, oldest to newest.
 *
 * @param {{ series: Array<Record<string, number>> }} props
 */
export function ResponseTimeChart({ series }) {
  if (series.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        No calls recorded yet. Use “Simulate load” to generate traffic.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="call" stroke={AXIS_COLOR} fontSize={12} tickLine={false} />
          <YAxis
            stroke={AXIS_COLOR}
            fontSize={12}
            tickLine={false}
            label={{ value: "ms", angle: -90, position: "insideLeft", fill: AXIS_COLOR, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "0.5rem",
              color: "#e2e8f0",
            }}
            formatter={(value, name) => [`${value} ms`, name]}
            labelFormatter={(label) => `Call #${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#cbd5e1" }} />
          {SERVICE_IDS.map((serviceId) => (
            <Line
              key={serviceId}
              type="monotone"
              dataKey={serviceId}
              name={serviceId}
              stroke={SERVICE_COLORS[serviceId]}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
