/**
 * Titled section used by the chart and the log table.
 *
 * @param {{
 *   title: string,
 *   description?: string,
 *   actions?: import("react").ReactNode,
 *   children: import("react").ReactNode
 * }} props
 */
export function Panel({ title, description, actions, children }) {
  return (
    <section className="border border-slate-700 bg-slate-900 p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
