import { request } from "./apiClient";

/**
 * @param {AbortSignal} [signal]
 * @returns {Promise<import("./types").MetricsSummary>}
 */
export function getSummary(signal) {
  return request("/api/metrics/summary", { signal });
}

/**
 * @param {import("./types").LogFilters & { page?: number, size?: number }} filters
 * @param {AbortSignal} [signal]
 * @returns {Promise<import("./types").LogPage>}
 */
export function getLogs({ service, status, from, to, page = 0, size = 20 } = {}, signal) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (service) params.set("service", service);
  if (status) params.set("status", status);
  if (from) params.set("from", new Date(from).toISOString());
  if (to) params.set("to", new Date(to).toISOString());
  return request(`/api/metrics/logs?${params.toString()}`, { signal });
}

/**
 * Generates random traffic on the backend so the dashboard has data to show.
 *
 * @param {number} calls
 * @returns {Promise<{ calls: number, success: number, errors: number, durationMs: number }>}
 */
export function simulateLoad(calls) {
  return request("/api/metrics/simulate-load", { method: "POST", body: { calls } });
}
