import { lazy, Suspense, useCallback, useState } from "react";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Panel } from "../components/common/Panel";
import { ServiceCardList } from "../components/dashboard/ServiceCardList";
import { SimulateLoadButton } from "../components/dashboard/SimulateLoadButton";
import { LogFilters } from "../components/logs/LogFilters";
import { LogsTable } from "../components/logs/LogsTable";
import { useMetricsSummary } from "../hooks/useMetricsSummary";
import { useResponseTimeSeries } from "../hooks/useResponseTimeSeries";
import { useServiceLogs } from "../hooks/useServiceLogs";
import { useApiHealth } from "../hooks/useApiHealth";
import { CHART_SAMPLE_SIZE, POLLING_INTERVAL_MS } from "../constants";
import { formatDuration, formatPercentage, formatServiceName } from "../utils/formatters";

const EMPTY_FILTERS = { service: "", status: "", from: "", to: "" };
const ResponseTimeChart = lazy(() =>
  import("../components/charts/ResponseTimeChart").then((module) => ({ default: module.ResponseTimeChart })),
);

/**
 * Composes the dashboard: it owns the filters and the page, and wires the data
 * hooks to the presentational components. No HTTP call is made from here.
 */
export function DashboardPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [actionError, setActionError] = useState(null);

  const { summary, isLoading: isSummaryLoading, error: summaryError, refresh: refreshSummary } =
    useMetricsSummary();
  const { logPage, isLoading: areLogsLoading, error: logsError, refresh: refreshLogs } = useServiceLogs(
    filters,
    page,
  );
  const { series, isLoading: isChartLoading, error: chartError, refresh: refreshChart } =
    useResponseTimeSeries();
  const { health, isLoading: isHealthLoading, error: healthError } = useApiHealth();

  const refreshAll = useCallback(() => {
    setActionError(null);
    refreshSummary();
    refreshLogs();
    refreshChart();
  }, [refreshSummary, refreshLogs, refreshChart]);

  const changeFilters = useCallback((nextFilters) => {
    setPage(0);
    setFilters(nextFilters);
  }, []);

  const error = actionError ?? summaryError ?? logsError ?? chartError;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 sm:px-7 sm:py-9">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-700 pb-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center bg-sky-500 text-xl font-black text-slate-100">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Flujo de auditoría del proxy</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                Observatorio de microservicios
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Llamadas, latencia y errores · actualización cada {POLLING_INTERVAL_MS / 1000} s
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <HealthIndicator health={health} isLoading={isHealthLoading} error={healthError} />
            <SimulateLoadButton onFinished={refreshAll} onError={setActionError} />
          </div>
        </header>

        <ErrorMessage message={error} />

        <OverallStats summary={summary} />

        <ServiceCardList services={summary?.services ?? []} isLoading={isSummaryLoading} />

        <Panel
          title="Tiempo de respuesta"
          description={`Últimas ${CHART_SAMPLE_SIZE} llamadas de cada servicio, en milisegundos`}
        >
          <Suspense fallback={<p className="py-12 text-center text-sm text-slate-400">Cargando gráfico…</p>}>
            <ResponseTimeChart series={series} isLoading={isChartLoading} />
          </Suspense>
        </Panel>

        <Panel title="Registro de llamadas" description="Abre una solicitud para ver sus parámetros y respuesta">
          <div className="space-y-4">
            <LogFilters filters={filters} onChange={changeFilters} />
            <LogsTable logPage={logPage} isLoading={areLogsLoading} page={page} onPageChange={setPage} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   health: import("../api/types").HealthResponse | null,
 *   isLoading: boolean,
 *   error: string | null
 * }} props
 */
function HealthIndicator({ health, isLoading, error }) {
  const isOnline = health?.status === "UP";
  const label = isLoading ? "Comprobando API" : isOnline ? "API disponible" : "API sin conexión";
  const dotColor = isLoading ? "bg-amber-500" : isOnline ? "bg-emerald-600" : "bg-rose-600";

  return (
    <div
      className="flex min-h-10 items-center gap-2 border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200"
      title={error ?? (health?.services ? `Servicios: ${health.services.map(formatServiceName).join(", ")}` : label)}
      aria-live="polite"
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/**
 * @param {{ summary: import("../api/types").MetricsSummary | null }} props
 */
function OverallStats({ summary }) {
  if (!summary) return null;

  const stats = [
    { label: "Total de llamadas", value: summary.totalCalls },
    { label: "Errores", value: summary.totalErrors },
    { label: "Tasa de error", value: formatPercentage(summary.overallErrorRate) },
    { label: "Tiempo medio", value: formatDuration(summary.averageResponseTimeMs) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden border border-slate-700 bg-slate-700 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="border-t-2 border-sky-500 bg-slate-900 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-100">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
