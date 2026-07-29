import Projects from "@/sections/projects";
import GitHub from "@/sections/github";
import Contact from "@/sections/contact";
import Header from "@/sections/header";
import Overview from "@/sections/overview";
import Technologies from "@/sections/technologies";
import ParticleTypographyDense from "@/sections/particle-typography";
import { DottedGridSection } from "@/components/ui/dotted-grid";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">

        {/* Main Content Column with Full-Bleed Dotted Grid Lines */}
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Header Block */}
          <DottedGridSection id="header"><Header /></DottedGridSection>

          {/* Overview Block */}
          <DottedGridSection id="overview" className="py-2.5 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Overview
            </h2>
          </DottedGridSection>
          <DottedGridSection><Overview /></DottedGridSection>

          {/* Skills Block */}
          <DottedGridSection id="technologies" className="py-2.5 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Skills
            </h2>
          </DottedGridSection>
          <DottedGridSection><Technologies /></DottedGridSection>

          {/* Projects Block */}
          <DottedGridSection id="projects" className="py-2.5 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Projects
            </h2>
          </DottedGridSection>
          <DottedGridSection><Projects /></DottedGridSection>

          {/* Open Source Block */}
          <DottedGridSection id="github" className="py-2.5 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Open Source
            </h2>
          </DottedGridSection>
          <DottedGridSection><GitHub /></DottedGridSection>

          {/* Contact Block */}
          <DottedGridSection id="contact" className="py-2.5 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Contact
            </h2>
          </DottedGridSection>
          <DottedGridSection><Contact /></DottedGridSection>

          {/* Footer Particle Typography */}
          <div id="footer"><ParticleTypographyDense /></div>
        </div>

        {/* Right Index Sidebar with Dotted Grid Divider */}
        <aside className="hidden lg:block w-48 shrink-0 font-mono text-xs text-neutral-700 dark:text-neutral-400 font-medium">
          <div className="sticky top-10 flex flex-col gap-4 py-4 pl-6 border-l border-dotted border-neutral-300 dark:border-neutral-800/80">
            <div className="font-bold text-neutral-900 dark:text-neutral-200 tracking-wider text-xs uppercase mb-1">
              INDEX
            </div>

            <nav className="flex flex-col gap-2.5">
              <a href="#header" className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 transition-colors">
                <span>—</span> Experience
              </a>
              <a href="#projects" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Projects
              </a>
              <a href="#github" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Open Source
              </a>
              <a href="#technologies" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Skills
              </a>
              <a href="#overview" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Overview
              </a>
              <a href="#contact" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </aside>

      </div>
    </main>
  );
}
