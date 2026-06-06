import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name]?.trim();
  return value || "";
}

function validateSupabaseConfig(url: string, anonKey: string): void {
  if (!url || !anonKey) {
    throw new Error(
      ".env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY to'ldirilmagan.",
    );
  }

  if (anonKey.includes("...") || anonKey.length < 100) {
    throw new Error(
      "Anon kalit to'liq emas. Supabase → Project Settings → API → anon public kalitini butunlay nusxalang (eyJ... bilan boshlanadi, 200+ belgi).",
    );
  }

  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    throw new Error(
      "SUPABASE URL noto'g'ri. Misol: https://xxxx.supabase.co",
    );
  }

  if (!anonKey.startsWith("eyJ")) {
    throw new Error(
      "Anon kalit formati noto'g'ri. Faqat 'anon public' kalitini ishlating (service_role emas).",
    );
  }
}

export function getSupabase(): SupabaseClient {
  const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  validateSupabaseConfig(supabaseUrl, supabaseAnonKey);

  return createClient(supabaseUrl, supabaseAnonKey);
}
