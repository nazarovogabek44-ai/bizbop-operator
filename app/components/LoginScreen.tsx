"use client";

import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("operators")
        .select("id,name,login,password,role,is_active")
        .eq("login", login)
        .eq("password", password)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setError("Login yoki parol noto‘g‘ri");
        return;
      }

      localStorage.setItem("operator_id", data.id);
      localStorage.setItem("operator_name", data.name);
      localStorage.setItem("operator_login", data.login || "");
      localStorage.setItem("operator_role", data.role || "operator");

      onLogin();
    } catch {
      setError("Kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="mb-2 text-5xl font-bold">Bizbop Operator</h1>
      <p className="mb-8 text-[#8FB8AD]">Tizimga kirish</p>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#102824] p-5"
      >
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          placeholder="Login"
          className="mb-4 w-full rounded-2xl bg-white px-4 py-3 text-black outline-none"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          placeholder="Parol"
          className="mb-4 w-full rounded-2xl bg-white px-4 py-3 text-black outline-none"
        />

        {error && (
          <div className="mb-4 rounded-xl bg-red-700 p-3 text-center font-bold">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-[#42E8C2] py-3 font-bold text-black"
        >
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}