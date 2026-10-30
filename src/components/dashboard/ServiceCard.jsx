import { SERVICE_COLORS } from "../../constants";
import { formatDuration, formatPercentage, formatServiceName, formatTime } from "../../utils/formatters";

/**
 * One service: total calls, success rate and average response time.
 * Turns red when the backend flags the service as degraded (error rate above 15%).
 *
 * @param {{ metrics: import("../../api/types").ServiceMetrics }} props
 */
export function ServiceCard({ metrics }) {
  const { serviceId, totalCalls, successRate, averageResponseTimeMs, errorCalls, lastCallAt, degraded } =
    metrics;

  const containerStyles = degraded
    ? "border-rose-500/60 bg-rose-500/10"
    : "border-slate-800 bg-slate-900/60";

  return (
    <article
      className={`border border-slate-700 border-t-4 p-5 transition ${containerStyles}`}
      style={{ borderTopColor: degraded ? "#aa2e40" : SERVICE_COLORS[serviceId] }}
      aria-live="polite"
    >
      <header className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-semibold capitalize text-slate-100">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: SERVICE_COLORS[serviceId] ?? "#94a3b8" }}
            aria-hidden="true"
          />
          {formatServiceName(serviceId)}
        </h3>
        {degraded && (
          <span className="rounded-full border border-rose-500/50 bg-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-200">
            Degradado
          </span>
        )}
      </header>

      <dl className="grid grid-cols-3 gap-3 text-center">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Llamadas</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-100">{totalCalls}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Éxito</dt>
          <dd className={`mt-1 text-2xl font-semibold ${degraded ? "text-rose-300" : "text-emerald-300"}`}>
            {formatPercentage(successRate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Tiempo medio</dt>
          <dd className="mt-1 text-2xl font-semibold text-slate-100">
            {formatDuration(averageResponseTimeMs)}
          </dd>
        </div>
      </dl>

      <footer className="mt-4 flex justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
        <span>{errorCalls} errores</span>
        <span>Última llamada: {formatTime(lastCallAt)}</span>
      </footer>
    </article>
  );
}
