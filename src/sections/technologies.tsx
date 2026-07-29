import { techCategories } from "@/data/technologies";
import { Badge } from "@/components/ui/badge";

export default function Technologies() {
  return (
    <section className="flex flex-col w-full">
      <div className="border border-dotted border-neutral-300 dark:border-neutral-800/80 p-5 sm:p-6 rounded-2xl space-y-6 bg-neutral-50/10 dark:bg-neutral-900/10">
        {techCategories.map((category, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <Badge
                    key={index}
                    variant="outline"
                    className="
                      border-dotted border-neutral-300 dark:border-neutral-800
                      text-neutral-800 dark:text-neutral-100
                      bg-white/50 dark:bg-neutral-950/40
                      hover:bg-neutral-200 dark:hover:bg-neutral-800
                      transition-all
                      flex items-center gap-2 px-3 py-1.5 text-xs font-mono
                    "
                  >
                    <span className="text-sm">
                      <Icon />
                    </span>
                    <span>{tech.name}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
