import { useCallback, useState } from "react";
import { getSummary } from "../api/metricsApi";
import { POLLING_INTERVAL_MS } from "../constants";
import { isAbortError, usePolling } from "./usePolling";

/**
 * Per-service metrics for the dashboard cards, refreshed by polling.
 *
 * @returns {{
 *   summary: import("../api/types").MetricsSummary | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refresh: (signal?: AbortSignal) => Promise<void>
 * }}
 */
export function useMetricsSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async (signal) => {
    try {
      setSummary(await getSummary(signal));
      setError(null);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  usePolling(refresh, POLLING_INTERVAL_MS);

  return { summary, isLoading, error, refresh };
}
