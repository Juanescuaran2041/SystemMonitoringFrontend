import { useCallback, useState } from "react";
import { getLogs } from "../api/metricsApi";
import { LOGS_PAGE_SIZE, POLLING_INTERVAL_MS } from "../constants";
import { isAbortError, usePolling } from "./usePolling";

/**
 * Filtered and paginated logs, refreshed every few seconds. Changing the
 * filters or the page fetches again immediately.
 *
 * @param {import("../api/types").LogFilters} filters
 * @param {number} page zero based
 * @returns {{
 *   logPage: import("../api/types").LogPage | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   refresh: (signal?: AbortSignal) => Promise<void>
 * }}
 */
export function useServiceLogs(filters, page) {
  const [logPage, setLogPage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(
    async (signal) => {
      try {
        setLogPage(await getLogs({ ...filters, page, size: LOGS_PAGE_SIZE }, signal));
        setError(null);
      } catch (fetchError) {
        if (!isAbortError(fetchError)) setError(fetchError.message);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, page],
  );

  usePolling(refresh, POLLING_INTERVAL_MS, [filters, page]);

  return { logPage, isLoading, error, refresh };
}
