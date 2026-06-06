import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const BRANCH_ID = "c548d1b6-2b15-485a-8c79-34f3c8d7ffba";

const inputClass =
  "mb-3 w-full rounded-xl bg-white p-3 text-black placeholder:text-gray-500";

type NamedItem = { name: string };
type BranchItem = { id: string; name: string };

type DocItem = {
  id: string;
  document_number?: string | null;
  amount?: number | null;
  operator_name?: string | null;
  supplier?: string | null;
  receiver?: string | null;
  rasxod_type?: string | null;
  reason?: string | null;
  minus_sku?: string | null;
  minus_qty?: number | null;
  plus_sku?: string | null;
  plus_qty?: number | null;
  comment?: string | null;
  created_at?: string | null;
};

type ReportRow = {
  id: string;
  type: string;
  icon: string;
  operator_name: string;
  document_number: string;
  counterparty: string;
  amount: number;
  created_at: string;
};

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

async function savePrixod(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();
    const photoUrl = await uploadPhoto(formData.get("photo") as File | null, "prixod");

    const { error } = await supabase.from("prixod_documents").insert({
      branch_id: BRANCH_ID,
      operator_name: String(formData.get("operator_name") || ""),
      supplier: String(formData.get("supplier") || ""),
      document_number: String(formData.get("document_number") || ""),
      amount: Number(formData.get("amount") || 0),
      sku_count: Number(formData.get("sku_count") || 0),
      comment: String(formData.get("comment") || ""),
      nakladnoy_photo: photoUrl,
      photo_url: photoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=prixod");
}

async function saveRasxod(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();
    const photoUrl = await uploadPhoto(formData.get("photo") as File | null, "rasxod");

    const { error } = await supabase.from("rasxod_documents").insert({
      branch_id: BRANCH_ID,
      operator_name: String(formData.get("operator_name") || ""),
      rasxod_type: String(formData.get("rasxod_type") || ""),
      receiver: String(formData.get("receiver") || ""),
      document_number: String(formData.get("document_number") || ""),
      amount: Number(formData.get("amount") || 0),
      sku_count: Number(formData.get("sku_count") || 0),
      comment: String(formData.get("comment") || ""),
      nakladnoy_photo: photoUrl,
      photo_url: photoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=rasxod");
}

async function saveVozvrat(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();
    const photoUrl = await uploadPhoto(formData.get("photo") as File | null, "vozvrat");

    const { error } = await supabase.from("vozvrat_documents").insert({
      branch_id: BRANCH_ID,
      operator_name: String(formData.get("operator_name") || ""),
      supplier: String(formData.get("supplier") || ""),
      document_number: String(formData.get("document_number") || ""),
      amount: Number(formData.get("amount") || 0),
      sku_count: Number(formData.get("sku_count") || 0),
      reason: String(formData.get("reason") || ""),
      comment: String(formData.get("comment") || ""),
      photo_url: photoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=vozvrat");
}

async function savePeremesheniya(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();

    const fromBranchId = String(formData.get("from_branch_id") || "");
    const toBranchId = String(formData.get("to_branch_id") || "");

    if (fromBranchId === toBranchId) {
      redirect(
        "/?error=" + encodeURIComponent("Qayerdan va qayerga bir xil bo‘lmasin"),
      );
    }

    const photoUrl = await uploadPhoto(
      formData.get("photo") as File | null,
      "peremesheniya",
    );

    const { error } = await supabase.from("peremesheniya_documents").insert({
      operator_name: String(formData.get("operator_name") || ""),
      from_branch_id: fromBranchId,
      to_branch_id: toBranchId,
      document_number: String(formData.get("document_number") || ""),
      amount: Number(formData.get("amount") || 0),
      sku_count: Number(formData.get("sku_count") || 0),
      comment: String(formData.get("comment") || ""),
      photo_url: photoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=peremesheniya");
}

async function savePeresort(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();
    const photoUrl = await uploadPhoto(formData.get("photo") as File | null, "peresort");

    const { error } = await supabase.from("peresort_documents").insert({
      branch_id: BRANCH_ID,
      operator_name: String(formData.get("operator_name") || ""),
      document_number: String(formData.get("document_number") || ""),
      minus_sku: String(formData.get("minus_sku") || ""),
      minus_qty: Number(formData.get("minus_qty") || 0),
      plus_sku: String(formData.get("plus_sku") || ""),
      plus_qty: Number(formData.get("plus_qty") || 0),
      reason: String(formData.get("reason") || ""),
      comment: String(formData.get("comment") || ""),
      photo_url: photoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=peresort");
}

async function savePricePhotoReport(formData: FormData) {
  "use server";

  try {
    const supabase = getSupabase();

    const beforePhotoUrl = await uploadPhoto(
      formData.get("before_photo") as File | null,
      "price-before",
    );

    const afterPhotoUrl = await uploadPhoto(
      formData.get("after_photo") as File | null,
      "price-after",
    );

    const { error } = await supabase.from("price_photo_reports").insert({
      branch_id: BRANCH_ID,
      operator_name: String(formData.get("operator_name") || ""),
      comment: String(formData.get("comment") || ""),
      before_photo_url: beforePhotoUrl,
      after_photo_url: afterPhotoUrl,
      status: "tekshiruvda",
    });

    if (error) redirect("/?error=" + encodeURIComponent(error.message));
  } catch (error) {
    redirect(
      "/?error=" +
        encodeURIComponent(
          error instanceof Error ? error.message : "Foto yuklashda xato",
        ),
    );
  }

  redirect("/?saved=price_photo");
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    from?: string;
    to?: string;
    operator?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = getSupabase();

  const fromDate = params?.from || "";
  const toDate = params?.to || "";
  const operatorFilter = params?.operator || "";

  const { data: suppliersData } = await supabase
    .from("suppliers")
    .select("name")
    .order("name", { ascending: true });

  const { data: receiversData } = await supabase
    .from("receivers")
    .select("name")
    .order("name", { ascending: true });

  const { data: branchesData } = await supabase
    .from("branches")
    .select("id,name")
    .order("name", { ascending: true });

  let prixodQuery = supabase
    .from("prixod_documents")
    .select("id, document_number, amount, operator_name, supplier, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let rasxodQuery = supabase
    .from("rasxod_documents")
    .select("id, document_number, amount, operator_name, receiver, rasxod_type, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let vozvratQuery = supabase
    .from("vozvrat_documents")
    .select("id, document_number, amount, operator_name, supplier, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let peremesheniyaQuery = supabase
    .from("peremesheniya_documents")
    .select("id, document_number, amount, operator_name, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let peresortQuery = supabase
    .from("peresort_documents")
    .select("id, document_number, operator_name, minus_sku, minus_qty, plus_sku, plus_qty, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  let pricePhotoQuery = supabase
    .from("price_photo_reports")
    .select("id, operator_name, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (fromDate) {
    const fromIso = new Date(fromDate).toISOString();
    prixodQuery = prixodQuery.gte("created_at", fromIso);
    rasxodQuery = rasxodQuery.gte("created_at", fromIso);
    vozvratQuery = vozvratQuery.gte("created_at", fromIso);
    peremesheniyaQuery = peremesheniyaQuery.gte("created_at", fromIso);
    peresortQuery = peresortQuery.gte("created_at", fromIso);
    pricePhotoQuery = pricePhotoQuery.gte("created_at", fromIso);
  }

  if (toDate) {
    const toIso = new Date(toDate).toISOString();
    prixodQuery = prixodQuery.lte("created_at", toIso);
    rasxodQuery = rasxodQuery.lte("created_at", toIso);
    vozvratQuery = vozvratQuery.lte("created_at", toIso);
    peremesheniyaQuery = peremesheniyaQuery.lte("created_at", toIso);
    peresortQuery = peresortQuery.lte("created_at", toIso);
    pricePhotoQuery = pricePhotoQuery.lte("created_at", toIso);
  }

  if (operatorFilter) {
    prixodQuery = prixodQuery.ilike("operator_name", `%${operatorFilter}%`);
    rasxodQuery = rasxodQuery.ilike("operator_name", `%${operatorFilter}%`);
    vozvratQuery = vozvratQuery.ilike("operator_name", `%${operatorFilter}%`);
    peremesheniyaQuery = peremesheniyaQuery.ilike("operator_name", `%${operatorFilter}%`);
    peresortQuery = peresortQuery.ilike("operator_name", `%${operatorFilter}%`);
    pricePhotoQuery = pricePhotoQuery.ilike("operator_name", `%${operatorFilter}%`);
  }

  const { data: prixodDocs } = await prixodQuery;
  const { data: rasxodDocs } = await rasxodQuery;
  const { data: vozvratDocs } = await vozvratQuery;
  const { data: peremesheniyaDocs } = await peremesheniyaQuery;
  const { data: peresortDocs } = await peresortQuery;
  const { data: pricePhotoDocs } = await pricePhotoQuery;

  const suppliers = (suppliersData ?? []) as NamedItem[];
  const receivers = (receiversData ?? []) as NamedItem[];
  const branches = (branchesData ?? []) as BranchItem[];

  const latestPrixod = (prixodDocs ?? []) as DocItem[];
  const latestRasxod = (rasxodDocs ?? []) as DocItem[];
  const latestVozvrat = (vozvratDocs ?? []) as DocItem[];
  const latestPeremesheniya = (peremesheniyaDocs ?? []) as DocItem[];
  const latestPeresort = (peresortDocs ?? []) as DocItem[];
  const latestPricePhoto = (pricePhotoDocs ?? []) as DocItem[];

  const reportRows: ReportRow[] = [
    ...latestPrixod.map((item) => ({
      id: item.id,
      type: "Prixod",
      icon: "📦",
      operator_name: item.operator_name || "-",
      document_number: item.document_number || "-",
      counterparty: item.supplier || "-",
      amount: Number(item.amount || 0),
      created_at: item.created_at || "",
    })),
    ...latestRasxod.map((item) => ({
      id: item.id,
      type: "Rasxod",
      icon: "📤",
      operator_name: item.operator_name || "-",
      document_number: item.document_number || "-",
      counterparty: item.receiver || item.rasxod_type || "-",
      amount: Number(item.amount || 0),
      created_at: item.created_at || "",
    })),
    ...latestVozvrat.map((item) => ({
      id: item.id,
      type: "Vazvrat",
      icon: "↩️",
      operator_name: item.operator_name || "-",
      document_number: item.document_number || "-",
      counterparty: item.supplier || item.reason || "-",
      amount: Number(item.amount || 0),
      created_at: item.created_at || "",
    })),
    ...latestPeremesheniya.map((item) => ({
      id: item.id,
      type: "Peremesheniya",
      icon: "🔁",
      operator_name: item.operator_name || "-",
      document_number: item.document_number || "-",
      counterparty: "Filiallar orasida",
      amount: Number(item.amount || 0),
      created_at: item.created_at || "",
    })),
    ...latestPeresort.map((item) => ({
      id: item.id,
      type: "Peresort",
      icon: "⚖️",
      operator_name: item.operator_name || "-",
      document_number: item.document_number || "-",
      counterparty: `${item.minus_sku || "-"} → ${item.plus_sku || "-"}`,
      amount: 0,
      created_at: item.created_at || "",
    })),
    ...latestPricePhoto.map((item) => ({
      id: item.id,
      type: "Narx foto",
      icon: "🏷️",
      operator_name: item.operator_name || "-",
      document_number: "-",
      counterparty: item.comment || "Foto otchyot",
      amount: 0,
      created_at: item.created_at || "",
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalAmount = reportRows.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-[#071A17] p-6 text-white">
      <div className="mx-auto max-w-3xl pb-10">
        <h1 className="text-5xl font-bold">Bizbop Operator</h1>
        <p className="mb-8 text-[#8FB8AD]">Mega Center • Operator</p>

        {params?.saved && (
          <div className="mb-4 rounded-xl bg-[#42E8C2] p-3 text-center font-bold text-black">
            ✅ {labelSaved(params.saved)} saqlandi
          </div>
        )}

        {params?.error && (
          <div className="mb-4 rounded-xl bg-red-700 p-3 text-center font-bold text-white">
            ❌ {params.error}
          </div>
        )}

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <h2 className="mb-4 text-2xl font-bold">📊 Dashboard</h2>

          <form className="mb-4 grid gap-3 md:grid-cols-4">
            <input name="from" type="datetime-local" defaultValue={fromDate} className={inputClass} />
            <input name="to" type="datetime-local" defaultValue={toDate} className={inputClass} />
            <input name="operator" placeholder="Operator ismi" defaultValue={operatorFilter} className={inputClass} />
            <button type="submit" className="mb-3 rounded-xl bg-[#42E8C2] p-3 font-bold text-black">
              Filtrlash
            </button>
          </form>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            <StatCard icon="📦" title="Prixod" value={latestPrixod.length} />
            <StatCard icon="📤" title="Rasxod" value={latestRasxod.length} />
            <StatCard icon="↩️" title="Vazvrat" value={latestVozvrat.length} />
            <StatCard icon="🔁" title="Perem." value={latestPeremesheniya.length} />
            <StatCard icon="⚖️" title="Peresort" value={latestPeresort.length} />
            <StatCard icon="🏷️" title="Narx foto" value={latestPricePhoto.length} />
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-[#102824] p-5">
          <h2 className="text-2xl font-bold">🧾 Otchyot</h2>
          <p className="mb-4 text-sm text-[#8FB8AD]">
            Filtrlangan hujjatlar soni: {reportRows.length}
          </p>

          <div className="mb-4 rounded-2xl bg-[#071A17] p-4">
            <div className="text-sm text-[#8FB8AD]">Umumiy summa</div>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()} so‘m</div>
          </div>

          <div className="mb-4 rounded-xl bg-white p-3 text-center font-bold text-black">
            PDF uchun: Ctrl + P → Save as PDF
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#21463D] text-left text-[#8FB8AD]">
                  <th className="p-2">Operator</th>
                  <th className="p-2">Sana</th>
                  <th className="p-2">Turi</th>
                  <th className="p-2">Hujjat №</th>
                  <th className="p-2">Kontragent / Izoh</th>
                  <th className="p-2 text-right">Summa</th>
                </tr>
              </thead>

              <tbody>
                {reportRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-[#8FB8AD]">
                      Bu davrda hujjat yo‘q
                    </td>
                  </tr>
                ) : (
                  reportRows.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-b border-[#21463D]/50">
                      <td className="p-2">{item.operator_name}</td>
                      <td className="p-2">{formatDate(item.created_at)}</td>
                      <td className="p-2">{item.icon} {item.type}</td>
                      <td className="p-2">№ {item.document_number}</td>
                      <td className="p-2">{item.counterparty}</td>
                      <td className="p-2 text-right">{item.amount.toLocaleString()} so‘m</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <FormSection title="📦 Prixod">
            <form action={savePrixod}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <Select name="supplier" label="Postavshik tanlang" items={suppliers} />
              <Input name="document_number" placeholder="Nakladnoy №" required />
              <Input name="amount" placeholder="Summa" type="number" />
              <Input name="sku_count" placeholder="SKU soni" type="number" />
              <Area name="comment" placeholder="Izoh" />
              <FileInput name="photo" label="Nakladnoy rasmi" />
              <SubmitButton text="Prixodni saqlash" />
            </form>
          </FormSection>

          <FormSection title="📤 Rasxod">
            <form action={saveRasxod}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <select name="rasxod_type" required className={inputClass} defaultValue="">
                <option value="" disabled>Rasxod turini tanlang</option>
                <option value="Filialga yuborish">Filialga yuborish</option>
                <option value="Markaziy skladga qaytarish">Markaziy skladga qaytarish</option>
                <option value="Boshqa">Boshqa</option>
              </select>
              <Select name="receiver" label="Qabul qiluvchi tanlang" items={receivers} />
              <Input name="document_number" placeholder="Rasxod hujjat №" required />
              <Input name="amount" placeholder="Summa" type="number" />
              <Input name="sku_count" placeholder="SKU soni" type="number" />
              <Area name="comment" placeholder="Izoh" />
              <FileInput name="photo" label="Rasxod rasmi" />
              <SubmitButton text="Rasxodni saqlash" />
            </form>
          </FormSection>

          <FormSection title="↩️ Vazvrat">
            <form action={saveVozvrat}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <Select name="supplier" label="Postavshik tanlang" items={suppliers} />
              <Input name="document_number" placeholder="Vazvrat hujjat №" required />
              <Input name="amount" placeholder="Summa" type="number" />
              <Input name="sku_count" placeholder="SKU soni" type="number" />
              <select name="reason" required className={inputClass} defaultValue="">
                <option value="" disabled>Vazvrat sababi</option>
                <option value="Brak">Brak</option>
                <option value="Srok">Srok</option>
                <option value="Ortiqcha keldi">Ortiqcha keldi</option>
                <option value="Noto'g'ri tovar">Noto&apos;g&apos;ri tovar</option>
                <option value="Boshqa">Boshqa</option>
              </select>
              <Area name="comment" placeholder="Izoh" />
              <FileInput name="photo" label="Vazvrat rasmi" />
              <SubmitButton text="Vazvratni saqlash" />
            </form>
          </FormSection>

          <FormSection title="🔁 Peremesheniya">
            <form action={savePeremesheniya}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <BranchSelect name="from_branch_id" label="Qayerdan tanlang" branches={branches} />
              <BranchSelect name="to_branch_id" label="Qayerga tanlang" branches={branches} />
              <Input name="document_number" placeholder="Peremesheniya hujjat №" required />
              <Input name="amount" placeholder="Summa" type="number" />
              <Input name="sku_count" placeholder="SKU soni" type="number" />
              <Area name="comment" placeholder="Izoh" />
              <FileInput name="photo" label="Peremesheniya rasmi" />
              <SubmitButton text="Peremesheniyani saqlash" />
            </form>
          </FormSection>

          <FormSection title="⚖️ Peresort">
            <form action={savePeresort}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <Input name="document_number" placeholder="Peresort hujjat №" required />
              <Input name="minus_sku" placeholder="Minus SKU / tovar nomi" required />
              <Input name="minus_qty" placeholder="Minus miqdor" type="number" required />
              <Input name="plus_sku" placeholder="Plus SKU / tovar nomi" required />
              <Input name="plus_qty" placeholder="Plus miqdor" type="number" required />

              <select name="reason" required className={inputClass} defaultValue="">
                <option value="" disabled>Peresort sababi</option>
                <option value="Noto‘g‘ri urilgan">Noto‘g‘ri urilgan</option>
                <option value="Kassadagi xato">Kassadagi xato</option>
                <option value="Qabuldagi xato">Qabuldagi xato</option>
                <option value="Inventarizatsiya natijasi">Inventarizatsiya natijasi</option>
                <option value="Shtrixkod xatosi">Shtrixkod xatosi</option>
                <option value="Boshqa">Boshqa</option>
              </select>

              <Area name="comment" placeholder="Izoh" />
              <FileInput name="photo" label="Peresort rasmi" />
              <SubmitButton text="Peresortni saqlash" />
            </form>
          </FormSection>

          <FormSection title="🏷️ Narx o‘zgartirish foto otchyot">
            <form action={savePricePhotoReport}>
              <Input name="operator_name" placeholder="Operator ismi" required />
              <Area name="comment" placeholder="Izoh" />
              <FileInput name="before_photo" label="Oldingi foto" />
              <FileInput name="after_photo" label="Keyingi foto" />
              <SubmitButton text="Foto otchyotni saqlash" />
            </form>
          </FormSection>
        </div>
      </div>
    </main>
  );
}

function labelSaved(value: string) {
  if (value === "prixod") return "Prixod";
  if (value === "rasxod") return "Rasxod";
  if (value === "vozvrat") return "Vazvrat";
  if (value === "peremesheniya") return "Peremesheniya";
  if (value === "peresort") return "Peresort";
  if (value === "price_photo") return "Narx foto otchyot";
  return value;
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

function StatCard({ icon, title, value }: { icon: string; title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#071A17] p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="text-sm text-[#8FB8AD]">{title}</div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-[#102824] p-5">
      <h2 className="mb-5 text-3xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Select({ name, label, items }: { name: string; label: string; items: NamedItem[] }) {
  return (
    <select name={name} required className={inputClass} defaultValue="">
      <option value="" disabled>{label}</option>
      {items.map((item) => (
        <option key={item.name} value={item.name}>{item.name}</option>
      ))}
    </select>
  );
}

function BranchSelect({ name, label, branches }: { name: string; label: string; branches: BranchItem[] }) {
  return (
    <select name={name} required className={inputClass} defaultValue="">
      <option value="" disabled>{label}</option>
      {branches.map((branch) => (
        <option key={branch.id} value={branch.id}>{branch.name}</option>
      ))}
    </select>
  );
}

function Input({
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

function Area({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      className="mb-4 min-h-24 w-full rounded-xl bg-white p-3 text-black placeholder:text-gray-500"
    />
  );
}

function FileInput({ name, label }: { name: string; label: string }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm text-[#8FB8AD]">{label}</label>
      <input
        name={name}
        type="file"
        accept="image/*"
        className="w-full rounded-xl border border-dashed border-[#42E8C2] bg-[#071A17] p-3 text-white"
      />
    </div>
  );
}

function SubmitButton({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-[#42E8C2] p-4 font-bold text-black"
    >
      {text}
    </button>
  );
}