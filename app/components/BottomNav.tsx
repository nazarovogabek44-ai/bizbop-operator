export type NavTab = "dashboard" | "tasks" | "docs" | "profile";

type NavItem = {
  id: NavTab;
  icon: string;
  label: string;
};

const items: NavItem[] = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "tasks", icon: "📝", label: "Ishlar" },
  { id: "docs", icon: "📦", label: "Hujjatlar" },
  { id: "profile", icon: "👤", label: "Profil" },
];

type BottomNavProps = {
  active: NavTab;
  onChange: (tab: NavTab) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#21463D]/80 bg-[#0A1F1B]/95 backdrop-blur-xl"
      aria-label="Asosiy navigatsiya"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-2 transition-colors ${
                isActive ? "text-[#42E8C2]" : "text-[#6B9A8F] hover:text-[#8FB8AD]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              <span
                className={`truncate text-[10px] font-medium sm:text-xs ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-[#42E8C2]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
