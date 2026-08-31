import { SkillBadge } from "@/components/skill-badge";
import { Marquee } from "@/components/ui/marquee";
import { skillMarqueeRows } from "@/data/technologies";

export default function Technologies() {
  return (
    <section className="flex w-full flex-col">
      <div className="overflow-hidden rounded-2xl border border-dotted border-neutral-300 bg-neutral-50/10 p-4 sm:p-5 dark:border-neutral-800/80 dark:bg-neutral-900/10">
        <div className="space-y-3">
          {skillMarqueeRows.map((row, idx) => (
            <Marquee
              key={idx}
              reverse={row.reverse}
              pauseOnHover
              repeat={3}
              className="[--duration:75s] [--gap:0.75rem] p-0"
            >
              {row.items.map((tech) => (
                <SkillBadge key={tech.name} tech={tech} />
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}
