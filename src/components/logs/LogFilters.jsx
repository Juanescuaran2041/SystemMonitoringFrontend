import { CALL_STATUSES, SERVICE_IDS } from "../../constants";
import { formatServiceName } from "../../utils/formatters";
import { Button } from "../common/Button";

const FIELD_STYLES =
  "mt-1 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 " +
  "focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400";

/**
 * @param {{
 *   filters: import("../../api/types").LogFilters,
 *   onChange: (filters: import("../../api/types").LogFilters) => void
 * }} props
 */
export function LogFilters({ filters, onChange }) {
  const update = (field) => (event) => onChange({ ...filters, [field]: event.target.value });

  return (
    <form
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr_1.3fr_auto] lg:items-end"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Filtrar registro de llamadas"
    >
      <label className="text-sm text-slate-300">
        Servicio
        <select className={FIELD_STYLES} value={filters.service} onChange={update("service")}>
          <option value="">Todos</option>
          {SERVICE_IDS.map((serviceId) => (
            <option key={serviceId} value={serviceId}>
              {formatServiceName(serviceId)}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-slate-300">
        Estado
        <select className={FIELD_STYLES} value={filters.status} onChange={update("status")}>
          <option value="">Todos</option>
          {CALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-slate-300">
        Desde
        <input
          type="datetime-local"
          className={FIELD_STYLES}
          value={filters.from}
          max={filters.to || undefined}
          onChange={update("from")}
        />
      </label>

      <label className="text-sm text-slate-300">
        Hasta
        <input
          type="datetime-local"
          className={FIELD_STYLES}
          value={filters.to}
          min={filters.from || undefined}
          onChange={update("to")}
        />
      </label>

      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange({ service: "", status: "", from: "", to: "" })}
      >
        Limpiar filtros
      </Button>
    </form>
  );
}
