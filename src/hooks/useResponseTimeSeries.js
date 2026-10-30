import { useCallback, useState } from "react";
import { getLogs } from "../api/metricsApi";
import { CHART_SAMPLE_SIZE, POLLING_INTERVAL_MS, SERVICE_IDS } from "../constants";
import { isAbortError, usePolling } from "./usePolling";

/**
 * Last N calls of every service, shaped for a multi line chart:
 * [{ call: 1, inventory: 45, orders: 30, payments: 120 }, ...] oldest first.
 *
 * @returns {{
 *   series: Array<Record<string, number>>,
 *   error: string | null,
 *   refresh: (signal?: AbortSignal) => Promise<void>
 * }}
 */
export function useResponseTimeSeries() {
  const [series, setSeries] = useState([]);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (signal) => {
    try {
      const pages = await Promise.all(
        SERVICE_IDS.map((serviceId) =>
          getLogs({ service: serviceId, size: CHART_SAMPLE_SIZE }, signal),
        ),
      );
      setSeries(toSeries(pages));
      setError(null);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) setError(fetchError.message);
    }
  }, []);

  usePolling(refresh, POLLING_INTERVAL_MS);

  return { series, error, refresh };
}

/**
 * @param {import("../api/types").LogPage[]} pages one page per service, newest first
 * @returns {Array<Record<string, number>>}
 */
function toSeries(pages) {
  const durationsByService = {};
  SERVICE_IDS.forEach((serviceId, index) => {
    // the backend returns newest first; the chart reads left to right in time order
    durationsByService[serviceId] = [...(pages[index]?.content ?? [])]
      .reverse()
      .map((log) => log.durationMs);
  });

  const longestRun = Math.max(0, ...SERVICE_IDS.map((id) => durationsByService[id].length));

  return Array.from({ length: longestRun }, (_, position) => {
    const point = { call: position + 1 };
    SERVICE_IDS.forEach((serviceId) => {
      const durations = durationsByService[serviceId];
      // align the series to the right so the newest call of each service is the last point
      const offset = position - (longestRun - durations.length);
      if (offset >= 0) point[serviceId] = durations[offset];
    });
    return point;
  });
}
