/**
 * @param {number} milliseconds
 * @returns {string} e.g. "87 ms" or "1.24 s"
 */
export function formatDuration(milliseconds) {
  if (milliseconds === null || milliseconds === undefined) return "—";
  if (milliseconds < 1000) return `${Math.round(milliseconds)} ms`;
  return `${(milliseconds / 1000).toFixed(2)} s`;
}

/**
 * @param {number} rate value between 0 and 1
 * @returns {string} e.g. "93.0%"
 */
export function formatPercentage(rate) {
  if (rate === null || rate === undefined) return "—";
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * @param {string | null} isoTimestamp
 * @returns {string} local time, e.g. "15:11:51"
 */
export function formatTime(isoTimestamp) {
  if (!isoTimestamp) return "—";
  return new Date(isoTimestamp).toLocaleTimeString();
}

/**
 * @param {string | null} isoTimestamp
 * @returns {string} local date and time
 */
export function formatDateTime(isoTimestamp) {
  if (!isoTimestamp) return "—";
  return new Date(isoTimestamp).toLocaleString();
}

/**
 * @param {unknown} value
 * @returns {string} pretty printed JSON, safe for unexpected values
 */
export function formatJson(value) {
  if (value === null || value === undefined) return "null";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
