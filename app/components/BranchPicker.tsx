import type { Branch } from "@/lib/branches";

type BranchPickerProps = {
  branches: Branch[];
  onSelect: (branch: Branch) => void;
};

export function BranchPicker({ branches, onSelect }: BranchPickerProps) {
  return (
    <div className="mx-auto max-w-md">
      <header className="mb-6 pt-4">
        <h1 className="text-3xl font-bold">Bizbop Operator</h1>
        <p className="text-[#8FB8AD]">Supabase ulandi</p>
      </header>

      <section className="rounded-3xl border border-[#21463D]/60 bg-[#102824] p-5 shadow-xl shadow-black/25">
        <h2 className="mb-4 text-xl font-bold">Filiallar</h2>

        {branches.length === 0 ? (
          <p className="text-yellow-300">Filial topilmadi</p>
        ) : (
          <div className="space-y-3">
            {branches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                onClick={() => onSelect(branch)}
                className="w-full rounded-2xl border border-[#1E4B42] bg-[#071A17] p-4 text-left font-medium transition active:scale-[0.98] hover:border-[#42E8C2]/40 hover:bg-[#0D221E]"
              >
                {branch.name}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
