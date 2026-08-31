import Projects from "@/sections/projects";
import GitHub from "@/sections/github";
import Contact from "@/sections/contact";
import Header from "@/sections/header";
import Overview from "@/sections/overview";
import Technologies from "@/sections/technologies";
import ParticleTypographyDense from "@/sections/particle-typography";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-6 lg:gap-8 justify-center">

        {/* Main Content Column with Full-Bleed Dotted Grid Lines */}
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Top Navbar */}
          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          {/* Header Block */}
          <DottedGridSection id="header"><Header /></DottedGridSection>

          {/* Overview Block */}
          <DottedGridSection id="overview" className="py-2.5 px-4 sm:px-6 flex items-center">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Overview
            </h2>
          </DottedGridSection>
          <DottedGridSection><Overview /></DottedGridSection>

          {/* Skills Block */}
          <DottedGridSection id="technologies" className="py-2.5 px-4 sm:px-6 flex items-center">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Skills
            </h2>
          </DottedGridSection>
          <DottedGridSection><Technologies /></DottedGridSection>

          {/* Projects Block */}
          <DottedGridSection id="projects" className="py-2.5 px-4 sm:px-6 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Projects
            </h2>
            <a
              href="/projects"
              className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
            >
              View all ↗
            </a>
          </DottedGridSection>
          <DottedGridSection><Projects /></DottedGridSection>

          {/* Open Source Block */}
          <DottedGridSection id="github" className="py-2.5 px-4 sm:px-6 flex items-center">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              GitHub Activity
            </h2>
          </DottedGridSection>
          <DottedGridSection><GitHub /></DottedGridSection>

          {/* Contact Block */}
          <DottedGridSection id="contact" className="py-2.5 px-4 sm:px-6 flex items-center">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
              Contact
            </h2>
          </DottedGridSection>
          <DottedGridSection><Contact /></DottedGridSection>

          {/* Footer Particle Typography */}
          <div id="footer"><ParticleTypographyDense /></div>
        </div>

      </div>
    </main>
  );
}
