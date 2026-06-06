export type RecordStatus = "Bajarildi" | "Tekshiruvda";

export type LocalRecord = {
  id: string;
  title: string;
  status: RecordStatus;
  createdAt: string;
  branchId: string;
};

const STORAGE_KEY = "bizbop-records";

export function loadRecords(branchId: string): LocalRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as LocalRecord[]) : [];

    return all
      .filter((record) => record.branchId === branchId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  } catch {
    return [];
  }
}

export function saveRecord(record: LocalRecord): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as LocalRecord[]) : [];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([record, ...all]),
    );

    const operatorName =
      localStorage.getItem("operator_name") || "Operator";

    const branchName =
      localStorage.getItem("operator_branch_name") ||
      localStorage.getItem("branch_name") ||
      "Mega Center";

    saveActivity(operatorName, branchName, record.title);
  } catch (error) {
    console.error("saveRecord error:", error);
  }
}

export async function saveActivity(
  operatorName: string,
  branchName: string,
  actionType: string,
): Promise<void> {
  try {
    const { getSupabase } = await import("./supabase");
    const supabase = getSupabase();

    await supabase.from("operator_activity").insert({
      operator_name: operatorName,
      branch_name: branchName,
      action_type: actionType,
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}

export function formatRecordTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return isToday ? `Bugun ${time}` : date.toLocaleDateString("uz-UZ");
}