import { useCallback, useState } from "react";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Panel } from "../components/common/Panel";
import { ResponseTimeChart } from "../components/charts/ResponseTimeChart";
import { ServiceCardList } from "../components/dashboard/ServiceCardList";
import { SimulateLoadButton } from "../components/dashboard/SimulateLoadButton";
import { LogFilters } from "../components/logs/LogFilters";
import { LogsTable } from "../components/logs/LogsTable";
import { useMetricsSummary } from "../hooks/useMetricsSummary";
import { useResponseTimeSeries } from "../hooks/useResponseTimeSeries";
import { useServiceLogs } from "../hooks/useServiceLogs";
import { CHART_SAMPLE_SIZE, POLLING_INTERVAL_MS } from "../constants";
import { formatDuration, formatPercentage } from "../utils/formatters";

const EMPTY_FILTERS = { service: "", status: "", from: "", to: "" };

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
  const { series, error: chartError, refresh: refreshChart } = useResponseTimeSeries();

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
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Microservice Monitoring</h1>
            <p className="mt-1 text-sm text-slate-400">
              Every call goes through the logging proxy · refreshed every {POLLING_INTERVAL_MS / 1000}s
            </p>
          </div>
          <SimulateLoadButton onFinished={refreshAll} onError={setActionError} />
        </header>

        <ErrorMessage message={error} />

        <OverallStats summary={summary} />

        <ServiceCardList services={summary?.services ?? []} isLoading={isSummaryLoading} />

        <Panel
          title="Response time"
          description={`Last ${CHART_SAMPLE_SIZE} calls per service, in milliseconds`}
        >
          <ResponseTimeChart series={series} />
        </Panel>

        <Panel title="Call log" description="Click a row to see the parameters and the full response">
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
 * @param {{ summary: import("../api/types").MetricsSummary | null }} props
 */
function OverallStats({ summary }) {
  if (!summary) return null;

  const stats = [
    { label: "Total calls", value: summary.totalCalls },
    { label: "Errors", value: summary.totalErrors },
    { label: "Error rate", value: formatPercentage(summary.overallErrorRate) },
    { label: "Avg. response", value: formatDuration(summary.averageResponseTimeMs) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-100">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
