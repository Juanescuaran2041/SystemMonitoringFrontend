const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Only place in the app that talks HTTP. Turns the backend error body
 * ({ timestamp, status, error, message }) into a regular Error.
 *
 * @param {string} path absolute path starting with /api
 * @param {{ method?: string, body?: unknown, signal?: AbortSignal }} [options]
 * @returns {Promise<unknown>} parsed JSON response
 */
export async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
  }
  return payload;
}

export { BASE_URL };
