type StatCardProps = {
  value: number;
  label: string;
  accent?: "default" | "success" | "warning" | "danger";
};

const accentClasses = {
  default: "text-white",
  success: "text-emerald-400",
  warning: "text-amber-400",
  danger: "text-red-400",
};

export function StatCard({ value, label, accent = "default" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#21463D]/60 bg-[#102824] p-4 shadow-lg shadow-black/20 transition-transform active:scale-[0.98]">
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#42E8C2]/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div
        className={`relative text-3xl font-bold tracking-tight ${accentClasses[accent]}`}
      >
        {value}
      </div>
      <div className="relative mt-1 text-sm text-[#8FB8AD]">{label}</div>
    </div>
  );
}
