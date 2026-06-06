import { getSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

const inputClass =
  "mb-3 w-full rounded-xl bg-white p-3 text-black placeholder:text-gray-500";

type Branch = {
  id: string;
  name: string;
};

type Operator = {
  id: string;
  name: string;
  login: string | null;
  password: string | null;
  role: string | null;
  branch_id: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

type OperatorPhoto = {
  id: string;
  operator_name: string | null;
  branch_name: string | null;
  photo_url: string | null;
  photo_type: string | null;
  created_at: string | null;
};

type OperatorActivity = {
  id: string;
  operator_name: string | null;
  branch_name: string | null;
  action_type: string | null;
  created_at: string | null;
};

type DocumentRow = {
  id: string;
  type: "Prixod" | "Rasxod" | "Vazvrat" | "Peresort";
  icon: string;
  created_at: string | null;
  operator_name: string | null;
  branch_id: string | null;
  branch_name?: string | null;
  counterparty: string | null;
  document_number: string | null;
  sku_count: number;
  amount: number;
  photo_url: string | null;
  comment: string | null;
};

async function addOperator(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const { error } = await supabase.from("operators").insert({
    name: String(formData.get("name") || ""),
    login: String(formData.get("login") || ""),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "operator"),
    branch_id: String(formData.get("branch_id") || "") || null,
    is_active: true,
  });

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=operator");
}

async function updateOperator(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("operators")
    .update({
      name: String(formData.get("name") || ""),
      login: String(formData.get("login") || ""),
      role: String(formData.get("role") || "operator"),
      branch_id: String(formData.get("branch_id") || "") || null,
    })
    .eq("id", id);

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=updated");
}

async function changePassword(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const id = String(formData.get("id") || "");
  const password = String(formData.get("password") || "");

  if (!password) {
    redirect("/admin?error=" + encodeURIComponent("Parol bo‘sh bo‘lmasin"));
  }

  const { error } = await supabase
    .from("operators")
    .update({ password })
    .eq("id", id);

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=password");
}

async function blockOperator(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const { error } = await supabase
    .from("operators")
    .update({ is_active: false })
    .eq("id", String(formData.get("id") || ""));

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=blocked");
}

async function activateOperator(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const { error } = await supabase
    .from("operators")
    .update({ is_active: true })
    .eq("id", String(formData.get("id") || ""));

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=active");
}

async function deleteOperator(formData: FormData) {
  "use server";

  const supabase = getSupabase();

  const { error } = await supabase
    .from("operators")
    .delete()
    .eq("id", String(formData.get("id") || ""));

  if (error) redirect("/admin?error=" + encodeURIComponent(error.message));
  redirect("/admin?saved=deleted");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    type?: string;
    operator?: string;
    branch?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = getSupabase();

  const selectedType = params?.type || "all";
  const selectedOperator = params?.operator || "";
  const selectedBranch = params?.branch || "";
  const search = (params?.q || "").toLowerCase();

  const { data: branchesData } = await supabase
    .from("branches")
    .select("id,name")
    .order("name", { ascending: true });

  const { data: operatorsData } = await supabase
    .from("operators")
    .select("id,name,login,password,role,branch_id,is_active,created_at")
    .order("created_at", { ascending: false });

  const { data: photosData } = await supabase
    .from("operator_photos")
    .select("id,operator_name,branch_name,photo_url,photo_type,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: activityData } = await supabase
    .from("operator_activity")
    .select("id,operator_name,branch_name,action_type,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: prixodData } = await supabase
    .from("prixod_documents")
    .select(
      "id,branch_id,operator_name,supplier,document_number,amount,sku_count,comment,nakladnoy_photo,photo_url,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const { data: rasxodData } = await supabase
    .from("rasxod_documents")
    .select(
      "id,branch_id,operator_name,rasxod_type,receiver,document_number,amount,sku_count,comment,nakladnoy_photo,photo_url,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const { data: vozvratData } = await supabase
    .from("vozvrat_documents")
    .select(
      "id,branch_id,operator_name,supplier,document_number,amount,sku_count,reason,comment,photo_url,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const { data: peresortData } = await supabase
    .from("peresort_documents")
    .select(
      "id,branch_id,operator_name,document_number,minus_sku,minus_qty,plus_sku,plus_qty,reason,comment,photo_url,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const branches = (branchesData ?? []) as Branch[];
  const operators = (operatorsData ?? []) as Operator[];
  const photos = (photosData ?? []) as OperatorPhoto[];
  const activities = (activityData ?? []) as OperatorActivity[];

  const documents: DocumentRow[] = [
    ...(prixodData ?? []).map((item: any) => ({
      id: item.id,
      type: "Prixod" as const,
      icon: "📦",
      created_at: item.created_at,
      operator_name: item.operator_name,
      branch_id: item.branch_id,
      counterparty: item.supplier,
      document_number: item.document_number,
      sku_count: Number(item.sku_count || 0),
      amount: Number(item.amount || 0),
      photo_url: item.photo_url || item.nakladnoy_photo || "",
      comment: item.comment,
    })),
    ...(rasxodData ?? []).map((item: any) => ({
      id: item.id,
      type: "Rasxod" as const,
      icon: "📤",
      created_at: item.created_at,
      operator_name: item.operator_name,
      branch_id: item.branch_id,
      counterparty: item.receiver || item.rasxod_type,
      document_number: item.document_number,
      sku_count: Number(item.sku_count || 0),
      amount: Number(item.amount || 0),
      photo_url: item.photo_url || item.nakladnoy_photo || "",
      comment: item.comment,
    })),
    ...(vozvratData ?? []).map((item: any) => ({
      id: item.id,
      type: "Vazvrat" as const,
      icon: "↩️",
      created_at: item.created_at,
      operator_name: item.operator_name,
      branch_id: item.branch_id,
      counterparty: item.supplier || item.reason,
      document_number: item.document_number,
      sku_count: Number(item.sku_count || 0),
      amount: Number(item.amount || 0),
      photo_url: item.photo_url || "",
      comment: item.comment,
    })),
    ...(peresortData ?? []).map((item: any) => ({
      id: item.id,
      type: "Peresort" as const,
      icon: "⚖️",
      created_at: item.created_at,
      operator_name: item.operator_name,
      branch_id: item.branch_id,
      counterparty: `${item.minus_sku || "-"} → ${item.plus_sku || "-"}`,
      document_number: item.document_number,
      sku_count: Number(item.minus_qty || 0) + Number(item.plus_qty || 0),
      amount: 0,
      photo_url: item.photo_url || "",
      comment: item.comment || item.reason,
    })),
  ]
    .map((doc) => ({
      ...doc,
      branch_name:
        branches.find((branch) => branch.id === doc.branch_id)?.name ||
        "Filial aniqlanmadi",
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime(),
    );

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesOperator =
      !selectedOperator || doc.operator_name === selectedOperator;
    const matchesBranch = !selectedBranch || doc.branch_id === selectedBranch;
    const matchesSearch =
      !search ||
      [
        doc.operator_name,
        doc.branch_name,
        doc.counterparty,
        doc.document_number,
        doc.comment,
        doc.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);

    return matchesType && matchesOperator && matchesBranch && matchesSearch;
  });

  const totalAmount = filteredDocuments.reduce(
    (sum, doc) => sum + doc.amount,
    0,
  );

  const today = new Date().toISOString().slice(0, 10);

  const todayDocuments = documents.filter(
    (doc) => doc.created_at?.slice(0, 10) === today,
  );

  const todayActivities = activities.filter(
    (item) => item.created_at?.slice(0, 10) === today,
  );

  const operatorRating = Object.entries(
    documents.reduce((acc, item) => {
      const name = item.operator_name || "Noma'lum";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const branchRating = Object.entries(
    documents.reduce((acc, item) => {
      const name = item.branch_name || "Noma'lum";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const uniqueOperators = Array.from(
    new Set(documents.map((doc) => doc.operator_name).filter(Boolean)),
  ) as string[];

  return (
    <main className="min-h-screen bg-[#071A17] p-6 text-white">
      <div className="mx-auto max-w-7xl pb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-5xl font-bold">Admin Panel</h1>
            <p className="text-[#8FB8AD]">
              Barcha hujjatlar, operatorlar, foto va activity log bitta joyda
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl bg-[#42E8C2] px-4 py-3 font-bold text-black"
          >
            ← Dashboard
          </a>
        </div>

        {params?.saved && (
          <div className="mb-4 rounded-xl bg-[#42E8C2] p-3 text-center font-bold text-black">
            ✅ Saqlandi
          </div>
        )}

        {params?.error && (
          <div className="mb-4 rounded-xl bg-red-700 p-3 text-center font-bold">
            ❌ {params.error}
          </div>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-6">
          <StatBox title="Prixod" value={(prixodData ?? []).length} icon="📦" />
          <StatBox title="Rasxod" value={(rasxodData ?? []).length} icon="📤" />
          <StatBox title="Vazvrat" value={(vozvratData ?? []).length} icon="↩️" />
          <StatBox
            title="Peresort"
            value={(peresortData ?? []).length}
            icon="⚖️"
          />
          <StatBox title="Foto" value={photos.length} icon="📸" />
          <StatBox title="Operator" value={operators.length} icon="👥" />
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <StatBox title="Bugungi hujjat" value={todayDocuments.length} icon="📊" />
          <StatBox
            title="Bugungi activity"
            value={todayActivities.length}
            icon="🧾"
          />
          <StatBox
            title="Aktiv operator"
            value={operators.filter((op) => op.is_active).length}
            icon="✅"
          />
          <StatBox
            title="Jami summa"
            valueText={`${totalAmount.toLocaleString()} so‘m`}
            icon="💰"
          />
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <h2 className="mb-4 text-3xl font-bold">🔎 Filtrlar</h2>

          <form className="grid gap-3 md:grid-cols-5">
            <select name="type" defaultValue={selectedType} className={inputClass}>
              <option value="all">Hammasi</option>
              <option value="Prixod">Prixod</option>
              <option value="Rasxod">Rasxod</option>
              <option value="Vazvrat">Vazvrat</option>
              <option value="Peresort">Peresort</option>
            </select>

            <select
              name="operator"
              defaultValue={selectedOperator}
              className={inputClass}
            >
              <option value="">Barcha operatorlar</option>
              {uniqueOperators.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>

            <select
              name="branch"
              defaultValue={selectedBranch}
              className={inputClass}
            >
              <option value="">Barcha filiallar</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <input
              name="q"
              defaultValue={params?.q || ""}
              placeholder="Qidiruv"
              className={inputClass}
            />

            <button className="mb-3 rounded-xl bg-[#42E8C2] p-3 font-bold text-black">
              Filtrlash
            </button>
          </form>
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">📋 Umumiy hujjatlar</h2>
            <div className="rounded-xl bg-[#071A17] px-4 py-2 font-bold">
              Jami: {filteredDocuments.length}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#071A17]">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#21463D] text-left text-[#8FB8AD]">
                  <th className="p-3">Sana</th>
                  <th className="p-3">Turi</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Filial</th>
                  <th className="p-3">Kontragent / Tovar</th>
                  <th className="p-3">Hujjat №</th>
                  <th className="p-3">SKU / Qty</th>
                  <th className="p-3 text-right">Summa</th>
                  <th className="p-3">Foto</th>
                  <th className="p-3">Izoh</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-[#8FB8AD]">
                      Hujjatlar yo‘q
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr
                      key={`${doc.type}-${doc.id}`}
                      className="border-b border-[#21463D]/50"
                    >
                      <td className="p-3">{formatDate(doc.created_at || "")}</td>
                      <td className="p-3">
                        {doc.icon} {doc.type}
                      </td>
                      <td className="p-3 font-bold">
                        {doc.operator_name || "-"}
                      </td>
                      <td className="p-3">{doc.branch_name || "-"}</td>
                      <td className="p-3">{doc.counterparty || "-"}</td>
                      <td className="p-3">№ {doc.document_number || "-"}</td>
                      <td className="p-3">{doc.sku_count || 0}</td>
                      <td className="p-3 text-right">
                        {doc.amount.toLocaleString()} so‘m
                      </td>
                      <td className="p-3">
                        {doc.photo_url ? (
                          <a
                            href={doc.photo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-[#42E8C2] px-3 py-2 font-bold text-black"
                          >
                            Ko‘rish
                          </a>
                        ) : (
                          <span className="text-[#8FB8AD]">Yo‘q</span>
                        )}
                      </td>
                      <td className="p-3">{doc.comment || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <RatingBox title="🏆 Operator reytingi" items={operatorRating} />
          <RatingBox title="🏢 Filial reytingi" items={branchRating} />
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <h2 className="mb-4 text-3xl font-bold">➕ Operator qo‘shish</h2>

          <form action={addOperator} className="grid gap-3 md:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Operator ismi"
              className={inputClass}
            />

            <input
              name="login"
              required
              placeholder="Login"
              className={inputClass}
            />

            <input
              name="password"
              required
              placeholder="Parol"
              className={inputClass}
            />

            <select
              name="role"
              required
              className={inputClass}
              defaultValue="operator"
            >
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
              <option value="director">Direktor</option>
              <option value="km">Kategoriya menejer</option>
            </select>

            <select name="branch_id" className={inputClass} defaultValue="">
              <option value="">Filial tanlanmagan</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <button className="mb-3 rounded-xl bg-[#42E8C2] p-3 font-bold text-black md:col-span-2">
              Operatorni qo‘shish
            </button>
          </form>
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">👥 Operatorlar ro‘yxati</h2>
            <div className="rounded-xl bg-[#071A17] px-4 py-2 font-bold">
              Jami: {operators.length}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#071A17]">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#21463D] text-left text-[#8FB8AD]">
                  <th className="p-3">Ism</th>
                  <th className="p-3">Login</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Filial</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tahrirlash</th>
                  <th className="p-3">Parol</th>
                  <th className="p-3">Amal</th>
                </tr>
              </thead>

              <tbody>
                {operators.map((op) => {
                  const branchName =
                    branches.find((b) => b.id === op.branch_id)?.name ||
                    "Filial yo‘q";

                  return (
                    <tr
                      key={op.id}
                      className="border-b border-[#21463D]/50 align-top"
                    >
                      <td className="p-3 font-bold">{op.name}</td>
                      <td className="p-3">{op.login || "-"}</td>
                      <td className="p-3">{op.role || "-"}</td>
                      <td className="p-3">{branchName}</td>
                      <td className="p-3">
                        {op.is_active ? "✅ Aktiv" : "⛔ Bloklangan"}
                      </td>

                      <td className="p-3">
                        <form action={updateOperator} className="grid gap-2">
                          <input type="hidden" name="id" value={op.id} />

                          <input
                            name="name"
                            defaultValue={op.name}
                            className="rounded-lg bg-white p-2 text-black"
                          />

                          <input
                            name="login"
                            defaultValue={op.login || ""}
                            className="rounded-lg bg-white p-2 text-black"
                          />

                          <select
                            name="role"
                            defaultValue={op.role || "operator"}
                            className="rounded-lg bg-white p-2 text-black"
                          >
                            <option value="operator">Operator</option>
                            <option value="admin">Admin</option>
                            <option value="director">Direktor</option>
                            <option value="km">Kategoriya menejer</option>
                          </select>

                          <select
                            name="branch_id"
                            defaultValue={op.branch_id || ""}
                            className="rounded-lg bg-white p-2 text-black"
                          >
                            <option value="">Filial tanlanmagan</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </select>

                          <button className="rounded-lg bg-[#42E8C2] px-3 py-2 font-bold text-black">
                            Saqlash
                          </button>
                        </form>
                      </td>

                      <td className="p-3">
                        <form action={changePassword} className="grid gap-2">
                          <input type="hidden" name="id" value={op.id} />

                          <input
                            name="password"
                            placeholder="Yangi parol"
                            className="rounded-lg bg-white p-2 text-black"
                          />

                          <button className="rounded-lg bg-[#42E8C2] px-3 py-2 font-bold text-black">
                            Parolni almashtirish
                          </button>
                        </form>
                      </td>

                      <td className="p-3">
                        <div className="grid gap-2">
                          {op.is_active ? (
                            <form action={blockOperator}>
                              <input type="hidden" name="id" value={op.id} />
                              <button className="w-full rounded-lg bg-orange-600 px-3 py-2 font-bold">
                                Bloklash
                              </button>
                            </form>
                          ) : (
                            <form action={activateOperator}>
                              <input type="hidden" name="id" value={op.id} />
                              <button className="w-full rounded-lg bg-[#42E8C2] px-3 py-2 font-bold text-black">
                                Aktiv qilish
                              </button>
                            </form>
                          )}

                          <form action={deleteOperator}>
                            <input type="hidden" name="id" value={op.id} />
                            <button className="w-full rounded-lg bg-red-700 px-3 py-2 font-bold">
                              O‘chirish
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">📸 Foto galereya</h2>
            <div className="rounded-xl bg-[#071A17] px-4 py-2 font-bold">
              Jami: {photos.length}
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="rounded-2xl bg-[#071A17] p-6 text-center text-[#8FB8AD]">
              Hozircha foto yo‘q
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.photo_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-2xl bg-[#071A17]"
                >
                  {photo.photo_url ? (
                    <img
                      src={photo.photo_url}
                      alt={photo.photo_type || "Operator foto"}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-[#8FB8AD]">
                      Foto yo‘q
                    </div>
                  )}

                  <div className="p-4">
                    <div className="font-bold">
                      {photo.photo_type || "Foto otchyot"}
                    </div>
                    <div className="text-sm text-[#8FB8AD]">
                      {photo.operator_name || "-"} • {photo.branch_name || "-"}
                    </div>
                    <div className="mt-1 text-xs text-[#8FB8AD]">
                      {formatDate(photo.created_at || "")}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-[#102824] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">🧾 Activity Log</h2>
            <div className="rounded-xl bg-[#071A17] px-4 py-2 font-bold">
              Oxirgi: {activities.length}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#071A17]">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#21463D] text-left text-[#8FB8AD]">
                  <th className="p-3">Sana</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Filial</th>
                  <th className="p-3">Harakat</th>
                </tr>
              </thead>

              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-[#8FB8AD]">
                      Activity log yo‘q
                    </td>
                  </tr>
                ) : (
                  activities.map((item) => (
                    <tr key={item.id} className="border-b border-[#21463D]/50">
                      <td className="p-3">
                        {formatDate(item.created_at || "")}
                      </td>
                      <td className="p-3 font-bold">
                        {item.operator_name || "-"}
                      </td>
                      <td className="p-3">{item.branch_name || "-"}</td>
                      <td className="p-3">{item.action_type || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatBox({
  title,
  value,
  valueText,
  icon,
}: {
  title: string;
  value?: number;
  valueText?: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl bg-[#102824] p-5">
      <div className="text-3xl">{icon}</div>
      <div className="mt-3 text-3xl font-bold">
        {valueText || Number(value || 0).toLocaleString()}
      </div>
      <div className="text-[#8FB8AD]">{title}</div>
    </div>
  );
}

function RatingBox({
  title,
  items,
}: {
  title: string;
  items: [string, number][];
}) {
  return (
    <div className="rounded-3xl bg-[#102824] p-5">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>

      {items.length === 0 ? (
        <div className="rounded-xl bg-[#071A17] p-4 text-center text-[#8FB8AD]">
          Ma’lumot yo‘q
        </div>
      ) : (
        items.map(([name, count], index) => (
          <div
            key={name}
            className="mb-2 flex items-center justify-between rounded-xl bg-[#071A17] p-3"
          >
            <span>
              {index === 0
                ? "🥇 "
                : index === 1
                  ? "🥈 "
                  : index === 2
                    ? "🥉 "
                    : ""}
              {name}
            </span>
            <span className="font-bold">{count}</span>
          </div>
        ))
      )}
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}