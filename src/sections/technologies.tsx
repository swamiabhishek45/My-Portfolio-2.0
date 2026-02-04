import {
  SiTypescript,
  SiExpress,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiReact,
  SiHtml5,
  SiTailwindcss,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiLinux,
  SiCss3,
  SiMysql,
  SiSupabase,
} from "react-icons/si";
import { Badge } from "@/components/ui/badge";

export default function Technologies() {
  const categories = [
    {
      name: "Programming Languages",
      items: [
        { name: "C", icon: <SiC /> },
        { name: "CPP", icon: <SiCplusplus /> },
        { name: "JavaScript", icon: <SiJavascript /> },
        { name: "TypeScript", icon: <SiTypescript /> },
      ],
    },
    {
      name: "Frontend",
      items: [
        { name: "HTML", icon: <SiHtml5 /> },
        { name: "CSS", icon: <SiCss3 /> },
        { name: "React", icon: <SiReact /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      ],
    },
    {
      name: "Backend",
      items: [
        { name: "Node.js", icon: <SiNodedotjs /> },
        { name: "Express.js", icon: <SiExpress /> },
        { name: "Supabase", icon: <SiSupabase /> },
      ],
    },
    {
      name: "Database",
      items: [
        { name: "PostgreSQL", icon: <SiPostgresql /> },
        { name: "MySQL", icon: <SiMysql /> },
        { name: "MongoDB", icon: <SiMongodb /> },
      ],
    },
    {
      name: "Other Tools",
      items: [
        { name: "Git", icon: <SiGit /> },
        { name: "GitHub", icon: <SiGithub /> },
        { name: "Postman", icon: <SiPostman /> },
        { name: "Linux", icon: <SiLinux /> },
      ],
    },
  ];

  return (
    <section className="border p-5 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold mb-3 border-b border-neutral-400 pb-1">
        Technologies
      </h2>

      {categories.map((category, idx) => (
        <div key={idx}>
          <h3 className="text-lg font-medium mb-3 text-neutral-600 dark:text-neutral-400">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech, index) => (
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
                <span className="text-lg">{tech.icon}</span>
                <span>{tech.name}</span>
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
