import { useState } from "react";
import { simulateLoad } from "../../api/metricsApi";
import { SIMULATED_CALLS } from "../../constants";
import { Button } from "../common/Button";

/**
 * Triggers the backend simulation and refreshes the dashboard with the new data.
 *
 * @param {{ onFinished: () => void, onError: (message: string) => void }} props
 */
export function SimulateLoadButton({ onFinished, onError }) {
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);
    try {
      await simulateLoad(SIMULATED_CALLS);
      onFinished();
    } catch (error) {
      onError(error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Button onClick={run} disabled={isRunning}>
      {isRunning ? "Simulating…" : `Simulate load (${SIMULATED_CALLS} calls)`}
    </Button>
  );
}
