import { FileText, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { overviewData } from "@/data/overview";

export default function Overview() {
  return (
    <section className="flex flex-col w-full">
      {/* Section Heading */}
      <h2 className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-2 px-1 select-none">
        Overview
      </h2>

      {/* Outer Card */}
      <div className="border border-neutral-200 dark:border-neutral-800/80 p-4 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10">
        {/* Inner Card */}
        <div className="border border-neutral-200/60 dark:border-neutral-800/60 p-5 rounded-xl bg-white/40 dark:bg-black/50 backdrop-blur-xs">
          <div className="flex flex-col gap-4">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shrink-0">
                  <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <a
                  href={overviewData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium text-sm sm:text-base transition-colors"
                >
                  Resume <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shrink-0">
                  <MapPin className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
                  {overviewData.location}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shrink-0">
                  <Phone className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <a
                  href={overviewData.phoneRaw}
                  className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium text-sm sm:text-base transition-colors"
                >
                  {overviewData.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shrink-0">
                  <Mail className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <a
                  href={`mailto:${overviewData.email}`}
                  className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium text-sm sm:text-base break-all transition-colors"
                >
                  {overviewData.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
