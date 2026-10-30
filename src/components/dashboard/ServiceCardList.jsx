import { ServiceCard } from "./ServiceCard";

/**
 * @param {{ services: import("../../api/types").ServiceMetrics[], isLoading: boolean }} props
 */
export function ServiceCardList({ services, isLoading }) {
  if (isLoading && services.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((placeholder) => (
          <div key={placeholder} className="h-44 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {services.map((metrics) => (
        <ServiceCard key={metrics.serviceId} metrics={metrics} />
      ))}
    </div>
  );
}
