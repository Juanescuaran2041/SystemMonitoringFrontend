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
import { formatServiceName } from "../../utils/formatters";

const AXIS_COLOR = "#607286";

/**
 * Response time of the last calls of each service, oldest to newest.
 *
 * @param {{ series: Array<Record<string, number>>, isLoading?: boolean }} props
 */
export function ResponseTimeChart({ series, isLoading = false }) {
  if (isLoading && series.length === 0) {
    return (
      <div className="grid h-72 place-items-center" role="status" aria-label="Loading response time data">
        <div className="h-44 w-full animate-pulse border-b border-l border-slate-700 bg-gradient-to-t from-slate-800/70 to-transparent" />
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Aún no hay llamadas. Usa “Simular tráfico” para generar actividad.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e2e9" />
          <XAxis dataKey="call" stroke={AXIS_COLOR} fontSize={12} tickLine={false} />
          <YAxis
            stroke={AXIS_COLOR}
            fontSize={12}
            tickLine={false}
            label={{ value: "ms", angle: -90, position: "insideLeft", fill: AXIS_COLOR, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d2dde7",
              borderRadius: "0.25rem",
              color: "#1d2c66",
            }}
            formatter={(value, name) => [`${value} ms`, name]}
            labelFormatter={(label) => `Llamada ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#40516d" }} />
          {SERVICE_IDS.map((serviceId) => (
            <Line
              key={serviceId}
              type="monotone"
              dataKey={serviceId}
              name={formatServiceName(serviceId)}
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
