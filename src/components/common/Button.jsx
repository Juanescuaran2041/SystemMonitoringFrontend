/**
 * Single place where button styling lives, so every action looks the same.
 *
 * @param {{
 *   children: import("react").ReactNode,
 *   onClick?: () => void,
 *   type?: "button" | "submit",
 *   variant?: "primary" | "secondary",
 *   disabled?: boolean
 * }} props
 */
export function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium " +
    "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 " +
    "disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-sky-500 text-slate-100 hover:bg-sky-400",
    secondary: "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
