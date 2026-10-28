import Projects from "@/sections/projects";
import GitHub from "@/sections/github";
import Contact from "@/sections/contact";
import Header from "@/sections/header";
import Overview from "@/sections/overview";
import Technologies from "@/sections/technologies";
import ParticleTypographyDense from "@/sections/particle-typography";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/projects";

export default function Page() {
  const projects = getProjects();
  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 transition-colors py-6 sm:py-10 overflow-x-clip">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 flex justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-5">

          {/* Top Navbar */}
          <DottedGridSection id="navbar"><Navbar /></DottedGridSection>

          {/* Header Block */}
          <DottedGridSection id="header"><Header /></DottedGridSection>

          {/* Overview Block */}
          <DottedGridSection id="overview" className="py-2 px-3 sm:px-4 flex items-center">
            <SectionHeading>Overview</SectionHeading>
          </DottedGridSection>
          <DottedGridSection><Overview /></DottedGridSection>

          {/* Skills Block */}
          <DottedGridSection id="technologies" className="py-2 px-3 sm:px-4 flex items-center">
            <SectionHeading>Skills</SectionHeading>
          </DottedGridSection>
          <DottedGridSection><Technologies /></DottedGridSection>

          {/* Projects Block */}
          <DottedGridSection id="projects" className="py-2 px-3 sm:px-4 flex items-center">
            <SectionHeading>Projects</SectionHeading>
          </DottedGridSection>
          <DottedGridSection className="px-2 sm:px-3">
            <Projects projects={projects} limit={2} />
          </DottedGridSection>

          {/* GitHub Activity */}
          <DottedGridSection id="github" className="px-2 sm:px-3">
            <GitHub />
          </DottedGridSection>

          {/* Contact Block */}
          <DottedGridSection id="contact" className="py-2 px-3 sm:px-4 flex items-center">
            <SectionHeading>Contact</SectionHeading>
          </DottedGridSection>
          <DottedGridSection><Contact /></DottedGridSection>

          {/* Footer Particle Typography */}
          <div id="footer"><ParticleTypographyDense /></div>
        </div>

      </div>
    </main>
  );
}
