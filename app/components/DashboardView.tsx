import { StatCard } from "./StatCard";
import { RecentTasks } from "./RecentTasks";
import type { FormType } from "./forms/OperatorForms";
import type { LocalRecord } from "@/lib/local-records";

const quickActions: {
  icon: string;
  label: string;
  form: FormType;
  primary?: boolean;
}[] = [
  { icon: "➕", label: "Ish qo‘shish", form: "work", primary: true },
  { icon: "📦", label: "Prixod", form: "prixod" },
  { icon: "📤", label: "Rasxod", form: "rasxod" },
  { icon: "📷", label: "Foto otchyot", form: "photo" },
];

type DashboardViewProps = {
  branchName: string;
  records: LocalRecord[];
  onOpenForm: (form: FormType) => void;
  onViewAllTasks: () => void;
};

export function DashboardView({
  branchName,
  records,
  onOpenForm,
  onViewAllTasks,
}: DashboardViewProps) {
  const pending = records.filter((r) => r.status === "Tekshiruvda").length;
  const total = records.length;
  const done = records.filter((r) => r.status === "Bajarildi").length;
  const errors = 0;

  const operatorStats = {
    prixod: records.filter((r) => r.title === "Prixod").length,
    rasxod: records.filter((r) => r.title === "Rasxod").length,
    vozvrat: records.filter((r) => r.title === "Vazvrat").length,
    perem: records.filter((r) => r.title === "Peremesheniya").length,
    peresort: records.filter((r) => r.title === "Peresort").length,
    narxFoto: records.filter(
      (r) => r.title === "Foto otchyot" || r.title === "Narx foto",
    ).length,
  };

  const totalOperatorWorks =
    operatorStats.prixod +
    operatorStats.rasxod +
    operatorStats.vozvrat +
    operatorStats.perem +
    operatorStats.peresort +
    operatorStats.narxFoto;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">{branchName}</h1>
        <p className="text-[#8FB8AD]">Operator Dashboard</p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Jami" value={total} />
        <StatCard label="Tekshiruvda" value={pending} accent="warning" />
        <StatCard label="Bajarildi" value={done} accent="success" />
        <StatCard label="Xato" value={errors} accent="danger" />
      </section>

      <section className="rounded-3xl bg-[#102824] p-5">
        <h2 className="mb-4 text-2xl font-bold">⚡ Tezkor amallar</h2>

        <div className="grid gap-4">
          {quickActions.map((action) => (
            <button
              key={action.form}
              type="button"
              onClick={() => onOpenForm(action.form)}
              className={
                action.primary
                  ? "rounded-2xl bg-[#42E8C2] p-5 text-left text-xl font-bold text-[#071A17]"
                  : "rounded-2xl bg-[#071A17] p-5 text-left text-xl font-bold"
              }
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#102824] p-5">
        <h2 className="mb-4 text-2xl font-bold">👤 Operator statistikasi</h2>

        <div className="grid grid-cols-2 gap-3">
          <MiniStat icon="📦" title="Prixod" value={operatorStats.prixod} />
          <MiniStat icon="📤" title="Rasxod" value={operatorStats.rasxod} />
          <MiniStat icon="↩️" title="Vazvrat" value={operatorStats.vozvrat} />
          <MiniStat
            icon="🔁"
            title="Peremesheniya"
            value={operatorStats.perem}
          />
          <MiniStat icon="⚖️" title="Peresort" value={operatorStats.peresort} />
          <MiniStat
            icon="🏷️"
            title="Narx foto"
            value={operatorStats.narxFoto}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-[#42E8C2] p-4 text-center font-bold text-black">
          Jami bajarilgan ish: {totalOperatorWorks}
        </div>
      </section>

      <section className="rounded-3xl bg-[#102824] p-5">
        <h2 className="mb-4 text-2xl font-bold">👨‍💼 Admin boshqaruv</h2>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="/admin"
            className="rounded-xl bg-[#42E8C2] p-4 text-center font-bold text-black"
          >
            Operator qo‘shish
          </a>

          <a
            href="/admin"
            className="rounded-xl bg-[#42E8C2] p-4 text-center font-bold text-black"
          >
            Operatorlar ro‘yxati
          </a>

          <a
            href="/admin"
            className="rounded-xl bg-[#42E8C2] p-4 text-center font-bold text-black"
          >
            Statistika
          </a>

          <a
            href="/admin"
            className="rounded-xl bg-[#42E8C2] p-4 text-center font-bold text-black"
          >
            Reyting
          </a>
        </div>
      </section>

      <RecentTasks records={records} onViewAll={onViewAllTasks} />
    </div>
  );
}

function MiniStat({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-[#071A17] p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="text-sm text-[#8FB8AD]">{title}</div>
    </div>
  );
}