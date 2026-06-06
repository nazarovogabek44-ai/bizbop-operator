"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Branch } from "@/lib/branches";
import { getSupabase } from "@/lib/supabase";
import {
  loadRecords,
  saveRecord,
  type LocalRecord,
} from "@/lib/local-records";
import type { FormType } from "./forms/OperatorForms";
import { BranchPicker } from "./BranchPicker";
import { DashboardView } from "./DashboardView";
import { FormByType } from "./forms/OperatorForms";

export function OperatorApp({ branches }: { branches: Branch[] }) {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [operatorId, setOperatorId] = useState("");
  const [operatorName, setOperatorName] = useState("Operator");
  const [operatorRole, setOperatorRole] = useState("operator");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOperatorId(localStorage.getItem("operator_id") || "");
    setOperatorName(localStorage.getItem("operator_name") || "Operator");
    setOperatorRole(localStorage.getItem("operator_role") || "operator");
  }, []);

  useEffect(() => {
    if (!branch) return;

    localStorage.setItem("branch_id", branch.id);
    localStorage.setItem("branch_name", branch.name);
    localStorage.setItem("operator_branch_name", branch.name);

    setRecords(loadRecords(branch.id));
  }, [branch]);

  async function uploadPhoto(file: File | null, folder: string) {
    if (!file || file.size === 0) return "";

    const supabase = getSupabase();

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("operator-photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("operator-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveActivity(branchName: string, actionType: string) {
    const supabase = getSupabase();

    await supabase.from("operator_activity").insert({
      operator_id: operatorId || null,
      operator_name: operatorName,
      branch_name: branchName,
      action_type: actionType,
    });
  }

  async function saveOperatorPhoto({
    branchName,
    photoUrl,
    photoType,
  }: {
    branchName: string;
    photoUrl: string;
    photoType: string;
  }) {
    if (!photoUrl) return;

    const supabase = getSupabase();

    await supabase.from("operator_photos").insert({
      operator_name: operatorName,
      branch_name: branchName,
      photo_url: photoUrl,
      photo_type: photoType,
    });
  }

  async function saveDocumentToSupabase(
    type: FormType,
    formData: FormData,
    photoUrl: string,
  ) {
    if (!branch) return;

    const supabase = getSupabase();

    if (type === "prixod") {
      const { error } = await supabase.from("prixod_documents").insert({
        branch_id: branch.id,
        operator_id: operatorId || null,
        operator_name: operatorName,
        supplier: String(formData.get("supplier") || ""),
        document_number: String(formData.get("document_number") || ""),
        amount: Number(formData.get("amount") || 0),
        sku_count: Number(formData.get("sku_count") || 0),
        comment: String(formData.get("comment") || ""),
        nakladnoy_photo: photoUrl,
        photo_url: photoUrl,
        status: "yaratildi",
      });

      if (error) throw new Error(error.message);
    }

    if (type === "rasxod") {
      const { error } = await supabase.from("rasxod_documents").insert({
        branch_id: branch.id,
        operator_id: operatorId || null,
        operator_name: operatorName,
        rasxod_type: String(formData.get("rasxod_type") || ""),
        receiver: String(formData.get("receiver") || ""),
        document_number: String(formData.get("document_number") || ""),
        amount: Number(formData.get("amount") || 0),
        sku_count: Number(formData.get("sku_count") || 0),
        comment: String(formData.get("comment") || ""),
        nakladnoy_photo: photoUrl,
        photo_url: photoUrl,
        status: "yaratildi",
      });

      if (error) throw new Error(error.message);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!branch || !activeForm || loading) return;

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("photo") as File | null;

      const photoType =
        String(formData.get("photo_type") || "") || getFormTitle(activeForm);

      const photoUrl = await uploadPhoto(file, activeForm);

      if (activeForm === "photo") {
        await saveOperatorPhoto({
          branchName: branch.name,
          photoUrl,
          photoType,
        });
      }

      if (activeForm === "prixod" || activeForm === "rasxod") {
        await saveDocumentToSupabase(activeForm, formData, photoUrl);
      }

      await saveActivity(branch.name, getFormTitle(activeForm));

      const record: LocalRecord = {
        id: crypto.randomUUID(),
        title: getFormTitle(activeForm),
        status: "Tekshiruvda",
        createdAt: new Date().toISOString(),
        branchId: branch.id,
      };

      saveRecord(record);
      setRecords(loadRecords(branch.id));
      setActiveForm(null);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Saqlashda xatolik yuz berdi",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  if (!branch) {
    return <BranchPicker branches={branches} onSelect={setBranch} />;
  }

  if (activeForm) {
    return (
      <div className="mx-auto max-w-md">
        {loading && (
          <div className="mb-4 rounded-xl bg-[#42E8C2] p-3 text-center font-bold text-[#071A17]">
            Saqlanmoqda...
          </div>
        )}

        <FormByType
          type={activeForm}
          branchName={branch.name}
          onBack={() => setActiveForm(null)}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold">{branch.name}</h1>
          <p className="text-[#8FB8AD]">
            {operatorName} • {operatorRole}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold"
        >
          Chiqish
        </button>
      </div>

      <button
        type="button"
        onClick={() => setBranch(null)}
        className="mb-5 w-full rounded-2xl bg-[#102824] p-3 font-bold text-white"
      >
        🏢 Filialni almashtirish
      </button>

      {operatorRole === "admin" && (
        <a
          href="/admin"
          className="mb-5 block rounded-2xl bg-[#42E8C2] p-4 text-center font-bold text-[#071A17]"
        >
          👨‍💼 Admin Panel
        </a>
      )}

      <DashboardView
        branchName={branch.name}
        records={records}
        onOpenForm={setActiveForm}
        onViewAllTasks={() => {}}
      />
    </div>
  );
}

function getFormTitle(type: FormType) {
  if (type === "work") return "Ish qo‘shish";
  if (type === "prixod") return "Prixod";
  if (type === "rasxod") return "Rasxod";
  if (type === "photo") return "Foto otchyot";

  return "Hujjat";
}