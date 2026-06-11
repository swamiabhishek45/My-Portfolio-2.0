import { aboutBullets } from "@/data/about";

export default function About() {
  return (
    <section className="flex flex-col w-full">
      {/* Section Heading */}
      <h2 className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-2 px-1 select-none">
        About me
      </h2>

      {/* Outer Card */}
      <div className="border border-neutral-200 dark:border-neutral-800/80 p-4 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10">
        {/* Inner Card */}
        <div className="border border-neutral-200/60 dark:border-neutral-800/60 p-5 rounded-xl bg-white/40 dark:bg-black/50 backdrop-blur-xs">
          <ul className="flex flex-col gap-3.5">
            {aboutBullets.map((bullet, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2.5 shrink-0" />
                <span>
                  {bullet.segments.map((seg, sIdx) => {
                    if (seg.bold) {
                      return (
                        <strong
                          key={sIdx}
                          className="font-semibold text-neutral-900 dark:text-neutral-100"
                        >
                          {seg.text}
                        </strong>
                      );
                    }
                    return <span key={sIdx}>{seg.text}</span>;
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

