/**
 * Call status. The colour is reinforced with text so it is not the only cue.
 *
 * @param {{ status: import("../../api/types").CallStatus }} props
 */
export function StatusBadge({ status }) {
  const isError = status === "ERROR";
  const styles = isError
    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";

  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}
