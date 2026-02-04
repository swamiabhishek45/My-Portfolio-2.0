import Projects from "@/sections/projects";
import GitHub from "@/sections/github";
import Contact from "@/sections/contact";
import Header from "@/sections/header";
import About from "@/sections/about";
import Technologies from "@/sections/technologies";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col gap-10 max-w-2xl mx-auto p-6 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Header />
      <About />
      <Technologies />
      <Projects />
      <GitHub />
      <Contact />
    </div>
  );
}
