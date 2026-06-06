import { getSupabase } from "@/lib/supabase";

export type Branch = {
  id: string;
  name: string;
};

export async function getBranches(): Promise<Branch[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("branches")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
