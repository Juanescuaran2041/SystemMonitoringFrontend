const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

/**
 * Only place in the app that talks HTTP. Turns the backend error body
 * ({ timestamp, status, error, message }) into a regular Error.
 *
 * @param {string} path absolute path starting with /api
 * @param {{ method?: string, body?: unknown, signal?: AbortSignal }} [options]
 * @returns {Promise<unknown>} parsed JSON response
 */
export async function request(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted || error.name === "AbortError") throw error;
    throw new Error(
      "No se pudo conectar con el backend. Verifica la URL de la API y vuelve a intentarlo.",
      { cause: error },
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
  }
  return payload;
}

export { BASE_URL };
