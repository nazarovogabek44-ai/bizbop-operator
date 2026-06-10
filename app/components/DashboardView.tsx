"use client";

import { useState } from "react";
import type { FormType } from "./forms/OperatorForms";
import type { LocalRecord } from "@/lib/local-records";
import { formatRecordTime } from "@/lib/local-records";

type DashboardViewProps = {
  branchName: string;
  records: LocalRecord[];
  onOpenForm: (form: FormType) => void;
  onViewAllTasks: () => void;
};

type ViewMode = "menu" | "dashboard" | "report";

export function DashboardView({
  branchName,
  records,
  onOpenForm,
}: DashboardViewProps) {
  const [view, setView] = useState<ViewMode>("menu");

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "Tekshiruvda").length,
    done: records.filter((r) => r.status === "Bajarildi").length,
    prixod: records.filter((r) => r.title === "Prixod").length,
    rasxod: records.filter((r) => r.title === "Rasxod").length,
    photo: records.filter((r) => r.title === "Foto otchyot").length,
    work: records.filter((r) => r.title === "Ish qo‘shish").length,
  };

  if (view === "dashboard") {
    return (
      <Screen title="📊 Dashboard" branchName={branchName} onBack={() => setView("menu")}>
        <div className="grid grid-cols-2 gap-3">
          <Stat title="Jami ish" value={stats.total} icon="📄" />
          <Stat title="Tekshiruvda" value={stats.pending} icon="⏳" />
          <Stat title="Bajarildi" value={stats.done} icon="✅" />
          <Stat title="Prixod" value={stats.prixod} icon="📦" />
          <Stat title="Rasxod" value={stats.rasxod} icon="📤" />
          <Stat title="Foto" value={stats.photo} icon="📸" />
        </div>
      </Screen>
    );
  }

  if (view === "report") {
    return (
      <Screen title="🧾 Otchyot" branchName={branchName} onBack={() => setView("menu")}>
        {records.length === 0 ? (
          <div className="rounded-3xl bg-[#102824] p-6 text-center text-[#8FB8AD]">
            Hozircha otchyot yo‘q
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl bg-[#102824] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">{record.title}</div>
                    <div className="text-sm text-[#8FB8AD]">
                      {formatRecordTime(record.createdAt)}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#071A17] px-3 py-2 text-sm font-bold">
                    {record.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Screen>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-[#102824] p-5">
        <h2 className="mb-4 text-2xl font-bold">⚡ Tezkor amallar</h2>

        <div className="grid gap-4">
          <ActionButton
            icon="➕"
            label="Ish qo‘shish"
            primary
            onClick={() => onOpenForm("work")}
          />

          <ActionButton
            icon="📦"
            label="Prixod"
            onClick={() => onOpenForm("prixod")}
          />

          <ActionButton
            icon="📤"
            label="Rasxod"
            onClick={() => onOpenForm("rasxod")}
          />

          <ActionButton
            icon="📸"
            label="Foto otchyot"
            onClick={() => onOpenForm("photo")}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-[#102824] p-5">
        <h2 className="mb-4 text-2xl font-bold">📂 Ko‘rish</h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className="rounded-2xl bg-[#42E8C2] p-5 text-left font-bold text-[#071A17]"
          >
            <div className="text-3xl">📊</div>
            <div className="mt-2">Dashboard</div>
          </button>

          <button
            type="button"
            onClick={() => setView("report")}
            className="rounded-2xl bg-[#42E8C2] p-5 text-left font-bold text-[#071A17]"
          >
            <div className="text-3xl">🧾</div>
            <div className="mt-2">Otchyot</div>
          </button>
        </div>
      </section>
    </div>
  );
}

function Screen({
  title,
  branchName,
  onBack,
  children,
}: {
  title: string;
  branchName: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl bg-[#42E8C2] px-4 py-2 font-bold text-[#071A17]"
      >
        ← Orqaga
      </button>

      <header>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-[#8FB8AD]">{branchName}</p>
      </header>

      {children}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "rounded-2xl bg-[#42E8C2] p-5 text-left text-xl font-bold text-[#071A17]"
          : "rounded-2xl bg-[#071A17] p-5 text-left text-xl font-bold"
      }
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-[#102824] p-4">
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="text-sm text-[#8FB8AD]">{title}</div>
    </div>
  );
}