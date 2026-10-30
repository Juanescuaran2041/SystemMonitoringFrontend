import { formatJson } from "../../utils/formatters";

/**
 * @param {{ log: import("../../api/types").ServiceCallLog }} props
 */
export function LogDetails({ log }) {
  const isError = log.status === "ERROR";

  return (
    <div className="grid gap-4 bg-slate-900/80 px-4 py-4 md:grid-cols-2">
      <Block title="Parámetros" content={formatJson(log.params)} />
      {isError ? (
        <Block title="Error" content={log.errorStackTrace ?? log.errorMessage ?? "Error desconocido"} tone="error" />
      ) : (
        <Block title="Respuesta" content={formatJson(log.result)} />
      )}
    </div>
  );
}

/**
 * @param {{ title: string, content: string, tone?: "default" | "error" }} props
 */
function Block({ title, content, tone = "default" }) {
  const textColor = tone === "error" ? "text-rose-200" : "text-slate-200";

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h4>
      <pre className={`max-h-64 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs ${textColor}`}>
        {content}
      </pre>
    </div>
  );
}
