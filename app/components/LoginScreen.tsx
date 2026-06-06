"use client";

import { useState, type FormEvent } from "react";
import { getTelegramBotUrl } from "@/lib/auth-session";
import { getSupabase } from "@/lib/supabase";

type LoginScreenProps = {
  onSuccess: () => void;
};

type Operator = {
  id: string;
  name: string;
  login: string | null;
  password: string | null;
  role: string | null;
  branch_id: string | null;
  is_active: boolean | null;
};

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanLogin = login.trim();
    const cleanPassword = password.trim();

    try {
      const supabase = getSupabase();

      const { data, error: loginError } = await supabase
        .from("operators")
        .select("id, name, login, password, role, branch_id, is_active")
        .eq("login", cleanLogin)
        .eq("password", cleanPassword)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle<Operator>();

      if (loginError || !data) {
        setError("Login yoki parol noto'g'ri");
        setLoading(false);
        return;
      }

      localStorage.setItem("operator_id", data.id);
      localStorage.setItem("operator_name", data.name || "");
      localStorage.setItem("operator_login", data.login || "");
      localStorage.setItem("operator_role", data.role || "operator");
      localStorage.setItem("operator_branch_id", data.branch_id || "");

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Login tekshirishda xatolik yuz berdi",
      );
    }
  }

  function openTelegram() {
    const url = getTelegramBotUrl();

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    setError("Telegram bot havolasi sozlanmagan (.env.local)");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f7f5] px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#c5d9d0 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-[28px] border border-[#e2ebe6] bg-white p-8 shadow-xl shadow-[#1a4d3e]/8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a4d3e] text-lg text-white">
            🛒
          </div>

          <span className="text-xl font-bold text-[#1a4d3e]">
            Bizbop Operator
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#1a4d3e]">
          Xush kelibsiz
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#5a7a6d]">
          Login va parol bilan tizimga kiring.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="login"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#6b9a87]"
            >
              LOGIN
            </label>

            <input
              id="login"
              name="login"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-2xl border-2 border-[#8fd4b8] bg-white px-4 py-3 text-[#1a4d3e] outline-none placeholder:text-[#9bb8aa] focus:border-[#1a4d3e]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#6b9a87]"
            >
              PAROL
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="1567654"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d8e5de] bg-white px-4 py-3 pr-12 text-[#1a4d3e] outline-none focus:border-[#1a4d3e]"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#7a9a8c]"
                aria-label={
                  showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#1a4d3e] py-3.5 text-base font-bold text-white transition hover:bg-[#236b54] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e2ebe6]" />

          <span className="text-xs font-semibold tracking-[0.25em] text-[#9bb8aa]">
            YOKI
          </span>

          <div className="h-px flex-1 bg-[#e2ebe6]" />
        </div>

        <button
          type="button"
          onClick={openTelegram}
          className="w-full rounded-2xl border border-[#d8e5de] bg-white py-3 text-sm font-semibold text-[#1a4d3e] transition hover:border-[#1a4d3e]/40 active:scale-[0.98]"
        >
          Telegram bot orqali kirish
        </button>
      </div>
    </div>
  );
}