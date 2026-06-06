type TaskStatus = "Bajarildi" | "Tekshiruvda" | "Xato";

type TaskCardProps = {
  title: string;
  time: string;
  status: TaskStatus;
};

const statusStyles: Record<
  TaskStatus,
  { badge: string; dot: string }
> = {
  Bajarildi: {
    badge: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Tekshiruvda: {
    badge: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    dot: "bg-amber-400",
  },
  Xato: {
    badge: "bg-red-500/15 text-red-400 ring-red-500/30",
    dot: "bg-red-400",
  },
};

export function TaskCard({ title, time, status }: TaskCardProps) {
  const styles = statusStyles[status];

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-[#21463D]/50 bg-[#0D221E] p-4 transition-colors hover:border-[#42E8C2]/20">
      <div
        className={`h-10 w-1 shrink-0 rounded-full ${styles.dot}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-[#6B9A8F]">{time}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset sm:text-xs ${styles.badge}`}
      >
        {status}
      </span>
    </article>
  );
}
