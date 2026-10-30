import { useCallback, useState } from "react";
import { getHealth } from "../api/metricsApi";
import { POLLING_INTERVAL_MS } from "../constants";
import { isAbortError, usePolling } from "./usePolling";

/**
 * Checks whether the deployed API is reachable and reports its service catalogue.
 *
 * @returns {{ health: import("../api/types").HealthResponse | null, isLoading: boolean, error: string | null }}
 */
export function useApiHealth() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async (signal) => {
    try {
      setHealth(await getHealth(signal));
      setError(null);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setHealth(null);
        setError(fetchError.message);
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  usePolling(refresh, POLLING_INTERVAL_MS);

  return { health, isLoading, error };
}
