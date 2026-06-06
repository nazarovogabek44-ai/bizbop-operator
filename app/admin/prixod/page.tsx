import { getSupabase } from "@/lib/supabase";

type PrixodDocument = {
  id: string;
  operator_id: string | null;
  branch_id: string | null;
  operator_name: string | null;
  supplier: string | null;
  document_number: string | null;
  amount: number | null;
  sku_count: number | null;
  comment: string | null;
  nakladnoy_photo: string | null;
  photo_url: string | null;
  status: string | null;
  created_at: string | null;
};

type Branch = {
  id: string;
  name: string;
};

export default async function AdminPrixodPage() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("prixod_documents")
    .select(
      "id,operator_id,branch_id,operator_name,supplier,document_number,amount,sku_count,comment,nakladnoy_photo,photo_url,status,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const { data: branchesData } = await supabase
    .from("branches")
    .select("id,name");

  const documents = (data ?? []) as PrixodDocument[];
  const branches = (branchesData ?? []) as Branch[];

  const totalAmount = documents.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const totalSku = documents.reduce(
    (sum, item) => sum + Number(item.sku_count || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#071A17] p-6 text-white">
      <div className="mx-auto max-w-7xl pb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-5xl font-bold">📦 Prixodlar</h1>
            <p className="text-[#8FB8AD]">
              Barcha prixod hujjatlari monitoringi
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-xl bg-[#42E8C2] px-4 py-3 font-bold text-black"
          >
            ← Admin Panel
          </a>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-700 p-3 text-center font-bold">
            ❌ {error.message}
          </div>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <StatBox title="Jami prixod" value={documents.length} icon="📦" />
          <StatBox title="Jami SKU" value={totalSku} icon="🔢" />
          <StatBox
            title="Jami summa"
            valueText={`${totalAmount.toLocaleString()} so‘m`}
            icon="💰"
          />
          <StatBox
            title="Foto bor"
            value={
              documents.filter((d) => d.photo_url || d.nakladnoy_photo).length
            }
            icon="📸"
          />
        </section>

        <section className="rounded-3xl bg-[#102824] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">Prixod ro‘yxati</h2>
            <div className="rounded-xl bg-[#071A17] px-4 py-2 font-bold">
              Jami: {documents.length}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#071A17]">
            <table className="w-full min-w-[1100px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#21463D] text-left text-[#8FB8AD]">
                  <th className="p-3">Sana</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Filial</th>
                  <th className="p-3">Postavshik</th>
                  <th className="p-3">Nakladnoy №</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Summa</th>
                  <th className="p-3">Foto</th>
                  <th className="p-3">Izoh</th>
                </tr>
              </thead>

              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-[#8FB8AD]">
                      Prixod hujjatlari yo‘q
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const branchName =
                      branches.find((b) => b.id === doc.branch_id)?.name ||
                      "Filial aniqlanmadi";

                    const photoUrl = doc.photo_url || doc.nakladnoy_photo || "";

                    return (
                      <tr key={doc.id} className="border-b border-[#21463D]/50">
                        <td className="p-3">{formatDate(doc.created_at || "")}</td>
                        <td className="p-3 font-bold">
                          {doc.operator_name || "-"}
                        </td>
                        <td className="p-3">{branchName}</td>
                        <td className="p-3">{doc.supplier || "-"}</td>
                        <td className="p-3">№ {doc.document_number || "-"}</td>
                        <td className="p-3">{doc.sku_count || 0}</td>
                        <td className="p-3 text-right">
                          {Number(doc.amount || 0).toLocaleString()} so‘m
                        </td>
                        <td className="p-3">
                          {photoUrl ? (
                            <a
                              href={photoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-[#42E8C2] px-3 py-2 font-bold text-black"
                            >
                              Ko‘rish
                            </a>
                          ) : (
                            <span className="text-[#8FB8AD]">Foto yo‘q</span>
                          )}
                        </td>
                        <td className="p-3">{doc.comment || "-"}</td>
                      </tr>
                    );
                  })
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