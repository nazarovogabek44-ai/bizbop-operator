import { TaskCard } from "./TaskCard";
import type { LocalRecord } from "@/lib/local-records";
import { formatRecordTime } from "@/lib/local-records";

const defaultTasks = [
  {
    title: "Narx o'zgartirish",
    time: "Bugun 10:25",
    status: "Bajarildi" as const,
  },
  {
    title: "Prixod kiritildi",
    time: "Bugun 11:40",
    status: "Tekshiruvda" as const,
  },
  {
    title: "Rasxod hujjati",
    time: "Bugun 14:05",
    status: "Tekshiruvda" as const,
  },
];

type RecentTasksProps = {
  records: LocalRecord[];
  onViewAll?: () => void;
};

export function RecentTasks({ records, onViewAll }: RecentTasksProps) {
  const localItems = records.map((r) => ({
    title: r.title,
    time: formatRecordTime(r.createdAt),
    status: r.status,
  }));

  const items = [...localItems, ...defaultTasks].slice(0, 8);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#21463D]/60 bg-[#102824] p-5 shadow-xl shadow-black/25">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">
          So&apos;nggi ishlar
        </h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-[#42E8C2] hover:underline sm:text-sm"
          >
            Barchasi
          </button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((task, i) => (
          <TaskCard
            key={`${task.title}-${task.time}-${i}`}
            title={task.title}
            time={task.time}
            status={task.status}
          />
        ))}
      </div>
    </section>
  );
}
