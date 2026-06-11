import { techCategories } from "@/data/technologies";
import { Badge } from "@/components/ui/badge";

export default function Technologies() {
  return (
    <section className="border p-5 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold mb-3 border-b border-neutral-400 pb-1">
        Technologies
      </h2>

      {techCategories.map((category, idx) => (
        <div key={idx}>
          <h3 className="text-lg font-medium mb-3 text-neutral-600 dark:text-neutral-400">
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
                    border-neutral-700
                    text-neutral-800 dark:text-neutral-100
                    hover:bg-neutral-200 dark:hover:bg-neutral-800
                    transition
                    flex items-center gap-2 p-2
                  "
                >
                  <span className="text-lg">
                    <Icon />
                  </span>
                  <span>{tech.name}</span>
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

