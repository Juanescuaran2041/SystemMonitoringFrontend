import { useEffect, useRef } from "react";

/**
 * Runs `callback` right away and then every `intervalMs`.
 * The in-flight request is aborted and the timer cleared on unmount, so no
 * state is updated after the component is gone.
 *
 * Changing a value in `deps` (a filter, a page) restarts the cycle, which also
 * fetches again straight away instead of waiting for the next tick.
 *
 * @param {(signal: AbortSignal) => void | Promise<void>} callback
 * @param {number} intervalMs
 * @param {unknown[]} [deps]
 */
export function usePolling(callback, intervalMs, deps = []) {
  const savedCallback = useRef(callback);

  // keeps the latest callback without restarting the timer on every render
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let isActive = true;
    let timerId;
    let controller;

    const tick = async () => {
      controller = new AbortController();
      try {
        await savedCallback.current(controller.signal);
      } finally {
        if (isActive) timerId = setTimeout(tick, intervalMs);
      }
    };

    void tick();

    return () => {
      isActive = false;
      clearTimeout(timerId);
      controller?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, ...deps]);
}

/**
 * Aborted requests are expected on unmount and must not be shown as errors.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}
