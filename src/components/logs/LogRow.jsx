import { SERVICE_COLORS } from "../../constants";
import { formatDateTime, formatDuration, formatServiceName } from "../../utils/formatters";
import { StatusBadge } from "../common/StatusBadge";
import { LogDetails } from "./LogDetails";

const COLUMN_COUNT = 6;

/**
 * @param {{
 *   log: import("../../api/types").ServiceCallLog,
 *   isExpanded: boolean,
 *   onToggle: (requestId: string) => void
 * }} props
 */
export function LogRow({ log, isExpanded, onToggle }) {
  const detailId = `details-${log.requestId}`;

  return (
    <>
      <tr className="border-t border-slate-800 hover:bg-slate-800/40">
        <td className="px-4 py-2 font-mono text-xs text-slate-400">
          <button
            type="button"
            onClick={() => onToggle(log.requestId)}
            aria-expanded={isExpanded}
            aria-controls={detailId}
            aria-label={`${isExpanded ? "Ocultar" : "Ver"} detalles de la solicitud ${log.requestId}`}
            className="rounded px-1 py-1 text-left underline decoration-slate-500/50 underline-offset-4 hover:text-[#c64a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {log.requestId.slice(0, 8)}
          </button>
        </td>
        <td className="px-4 py-2">
          <span className="flex items-center gap-2 capitalize text-slate-200">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: SERVICE_COLORS[log.serviceId] ?? "#64748b" }}
              aria-hidden="true"
            />
            {formatServiceName(log.serviceId)}
          </span>
        </td>
        <td className="px-4 py-2 text-slate-200">{log.operation}</td>
        <td className="px-4 py-2 text-right tabular-nums text-slate-200">
          {formatDuration(log.durationMs)}
        </td>
        <td className="px-4 py-2">
          <StatusBadge status={log.status} />
        </td>
        <td className="px-4 py-2 text-right text-xs text-slate-400">
          {formatDateTime(log.timestamp)}
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-t border-slate-800">
          <td id={detailId} colSpan={COLUMN_COUNT} className="p-0">
            <LogDetails log={log} />
          </td>
        </tr>
      )}
    </>
  );
}
