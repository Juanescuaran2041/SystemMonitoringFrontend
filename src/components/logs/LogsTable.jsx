import { useState } from "react";
import { LOGS_PAGE_SIZE } from "../../constants";
import { Button } from "../common/Button";
import { LogRow } from "./LogRow";

const HEADERS = ["Solicitud", "Servicio", "Operación", "Duración", "Estado", "Fecha y hora"];

/**
 * @param {{
 *   logPage: import("../../api/types").LogPage | null,
 *   isLoading: boolean,
 *   page: number,
 *   onPageChange: (page: number) => void
 * }} props
 */
export function LogsTable({ logPage, isLoading, page, onPageChange }) {
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const logs = logPage?.content ?? [];
  const totalPages = logPage?.totalPages ?? 0;

  const toggleRow = (requestId) => {
    setExpandedRequestId((current) => (current === requestId ? null : requestId));
  };

  if (isLoading && logs.length === 0) {
    return (
      <div className="space-y-2 py-3" role="status" aria-label="Cargando llamadas">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="h-11 animate-pulse rounded-md bg-slate-800" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="border-y border-slate-800 py-12 text-center">
        <p className="font-medium text-slate-200">No hay llamadas con estos filtros</p>
        <p className="mt-1 text-sm text-slate-400">Limpia un filtro o genera tráfico de muestra.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Llamadas registradas por el proxy de auditoría</caption>
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-4 py-3 font-medium ${
                    header === "Duration" || header === "Timestamp" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <LogRow
                key={log.requestId}
                log={log}
                isExpanded={expandedRequestId === log.requestId}
                onToggle={toggleRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400" aria-label="Paginación de llamadas">
        <span>
          Página {page + 1} de {Math.max(totalPages, 1)} · {logPage?.totalElements ?? 0} llamadas
          <span className="sr-only">, {LOGS_PAGE_SIZE} llamadas por página</span>
        </span>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Anterior
          </Button>
          <Button
            variant="secondary"
            disabled={totalPages === 0 || page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </nav>
    </div>
  );
}
