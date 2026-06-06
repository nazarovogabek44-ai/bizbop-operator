import type { ReactNode } from "react";

export type FormType = "work" | "prixod" | "rasxod" | "photo";

type FormByTypeProps = {
  type: FormType;
  branchName: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function FormByType({
  type,
  branchName,
  onBack,
  onSubmit,
}: FormByTypeProps) {
  if (type === "work") {
    return (
      <FormShell title="➕ Ish qo‘shish" branchName={branchName} onBack={onBack} onSubmit={onSubmit}>
        <Field label="Ish nomi">
          <input name="note" required placeholder="Masalan: Polka tekshirildi" className={inputClass} />
        </Field>
      </FormShell>
    );
  }

  if (type === "prixod") {
    return (
      <FormShell title="📦 Prixod" branchName={branchName} onBack={onBack} onSubmit={onSubmit}>
        <Field label="Postavshik">
          <input name="supplier" required placeholder="Postavshik nomi" className={inputClass} />
        </Field>

        <Field label="Nakladnoy №">
          <input name="document_number" required placeholder="Nakladnoy raqami" className={inputClass} />
        </Field>

        <Field label="Summa">
          <input name="amount" type="number" placeholder="Summa" className={inputClass} />
        </Field>

        <Field label="SKU soni">
          <input name="sku_count" type="number" placeholder="SKU soni" className={inputClass} />
        </Field>

        <Field label="Nakladnoy rasmi">
          <input name="photo" type="file" accept="image/*" className={fileClass} />
        </Field>

        <Field label="Izoh">
          <textarea name="comment" placeholder="Izoh" className={areaClass} />
        </Field>
      </FormShell>
    );
  }

  if (type === "rasxod") {
    return (
      <FormShell title="📤 Rasxod" branchName={branchName} onBack={onBack} onSubmit={onSubmit}>
        <Field label="Rasxod turi">
          <select name="rasxod_type" required className={inputClass} defaultValue="">
            <option value="" disabled>Tanlang</option>
            <option value="Filialga yuborish">Filialga yuborish</option>
            <option value="Markaziy skladga qaytarish">Markaziy skladga qaytarish</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </Field>

        <Field label="Qabul qiluvchi">
          <input name="receiver" required placeholder="Qabul qiluvchi" className={inputClass} />
        </Field>

        <Field label="Hujjat №">
          <input name="document_number" required placeholder="Hujjat raqami" className={inputClass} />
        </Field>

        <Field label="Summa">
          <input name="amount" type="number" placeholder="Summa" className={inputClass} />
        </Field>

        <Field label="Rasm">
          <input name="photo" type="file" accept="image/*" className={fileClass} />
        </Field>

        <Field label="Izoh">
          <textarea name="comment" placeholder="Izoh" className={areaClass} />
        </Field>
      </FormShell>
    );
  }

  return (
    <FormShell title="📸 Foto otchyot" branchName={branchName} onBack={onBack} onSubmit={onSubmit}>
      <Field label="Foto turi">
        <select name="photo_type" required className={inputClass} defaultValue="">
          <option value="" disabled>Tanlang</option>
          <option value="Narx foto">Narx foto</option>
          <option value="Polka foto">Polka foto</option>
          <option value="Promo foto">Promo foto</option>
          <option value="Boshqa">Boshqa</option>
        </select>
      </Field>

      <Field label="Foto">
        <input name="photo" required type="file" accept="image/*" className={fileClass} />
      </Field>

      <Field label="Izoh">
        <textarea name="comment" placeholder="Izoh" className={areaClass} />
      </Field>
    </FormShell>
  );
}

function FormShell({
  title,
  branchName,
  onBack,
  onSubmit,
  children,
}: {
  title: string;
  branchName: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 rounded-xl bg-[#42E8C2] px-4 py-2 font-bold text-[#071A17]"
      >
        ← Orqaga
      </button>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-[#21463D]/60 bg-[#102824] p-5"
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 mb-5 text-sm text-[#8FB8AD]">{branchName}</p>

        <div className="space-y-4">{children}</div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-[#42E8C2] py-3 font-bold text-[#071A17]"
        >
          Yuborish
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#8FB8AD]">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500";

const areaClass =
  "min-h-24 w-full rounded-2xl bg-white px-4 py-3 text-black outline-none placeholder:text-gray-500";

const fileClass =
  "w-full rounded-2xl border border-dashed border-[#42E8C2] bg-[#071A17] px-4 py-3 text-white";