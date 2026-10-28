"use client";

import { useEffect, useState, useRef, type CSSProperties } from "react";
import { Lightbulb, User, Globe } from "lucide-react";
import { overviewData } from "@/data/overview";
import SocialLinks from "@/components/social-links";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { MapPinIcon } from "@/components/ui/map-pin";
import { AtSignIcon } from "@/components/ui/at-sign";
import { LinkIcon } from "@/components/ui/link";
import { ClockIcon } from "@/components/ui/clock";
import { FolderCodeIcon } from "@/components/ui/folder-code";

const getIconComponent = (name: string) => {
  switch (name) {
    case "code":
      return FolderCodeIcon;
    case "lightbulb":
      return Lightbulb;
    case "user":
      return User;
    case "globe":
      return Globe;
    default:
      return FolderCodeIcon;
  }
};

const MaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="10" cy="14" r="5" />
    <path d="m19 5-5.5 5.5" />
    <path d="M14 5h5v5" />
  </svg>
);

const OverviewIcon = ({
  icon: Icon,
  size = 16,
  iconRef,
}: {
  icon: React.ComponentType<any>;
  size?: number;
  iconRef?: any;
}) => {
  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-[14px] border border-[#e4e4e7] dark:border-[#1f1f23] bg-[#f8f8fa] dark:bg-[#141416] p-[2px] shrink-0">
      <div className="w-full h-full flex items-center justify-center rounded-[10px] border border-[#d4d4d8] dark:border-[#2e2e33] bg-[#ededf0] dark:bg-[#1c1c1f]">
        <Icon ref={iconRef} size={size} className="text-neutral-800 dark:text-[#a1a1aa]" />
      </div>
    </div>
  );
};

const RoleItem = ({ role }: { role: typeof overviewData.roles[0] }) => {
  const iconRef = useRef<any>(null);
  const RoleIcon = getIconComponent(role.iconName);

  return (
    <div
      className="flex items-center gap-3 cursor-default animate-once"
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
    >
      <OverviewIcon icon={RoleIcon} iconRef={iconRef} />
      <span className="text-neutral-900 dark:text-neutral-200 font-semibold text-sm sm:text-base">
        {role.title}{" "}
        {role.company && (
          <span className="text-neutral-700 dark:text-neutral-400 font-medium">
            @{role.company}
          </span>
        )}
      </span>
    </div>
  );
};

export default function Overview() {
  const [time, setTime] = useState("");
  const [timeDiff, setTimeDiff] = useState("");

  const mapPinRef = useRef<any>(null);
  const linkRef = useRef<any>(null);
  const clockRef = useRef<any>(null);
  const emailRef = useRef<any>(null);

  useEffect(() => {
    const updateTime = () => {
      const targetZone = overviewData.timezone;
      try {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: targetZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(formatter.format(d));

        const targetString = d.toLocaleString("en-US", { timeZone: targetZone });
        const targetDate = new Date(targetString);
        const localString = d.toLocaleString("en-US");
        const localDate = new Date(localString);
        
        const diffMs = targetDate.getTime() - localDate.getTime();
        const diffHours = Math.round(diffMs / 3600000);

        if (diffHours === 0) {
          setTimeDiff("same time");
        } else if (diffHours > 0) {
          setTimeDiff(`${diffHours}h ahead`);
        } else {
          setTimeDiff(`${Math.abs(diffHours)}h behind`);
        }
      } catch (err) {
        console.error("Error updating timezone clock:", err);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const roleRowCount = overviewData.roles.length;

  return (
    <section className="flex flex-col w-full">
      {/* Outer Card Wrapper */}
      <div className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10 overflow-hidden font-mono">
        {/* Paired rows on desktop; single column on mobile */}
        <div
          className="overview-details-grid relative grid grid-cols-1 gap-4 p-5 md:grid-cols-2 md:gap-x-10 md:gap-y-4"
          style={
            {
              "--overview-role-rows": roleRowCount,
            } as CSSProperties
          }
        >
          <div className="pointer-events-none absolute top-5 bottom-5 left-1/2 hidden -translate-x-1/2 border-r border-dotted border-neutral-300 dark:border-neutral-800/80 md:block" />

          {overviewData.roles.map((role, row) => (
            <div
              key={role.title}
              className="overview-role min-h-9"
              data-role-index={row + 1}
            >
              <RoleItem role={role} />
            </div>
          ))}

          <div
            className="overview-loc flex min-h-9 items-center gap-3"
            onMouseEnter={() => mapPinRef.current?.startAnimation()}
            onMouseLeave={() => mapPinRef.current?.stopAnimation()}
          >
            <OverviewIcon icon={MapPinIcon} iconRef={mapPinRef} />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
              {overviewData.location}
            </span>
          </div>

          <div className="overview-web flex min-h-9 items-center gap-3">
            <OverviewIcon icon={LinkIcon} iconRef={linkRef} />
            <LineHoverLink
              href={overviewData.websiteRaw}
              target="_blank"
              rel="noopener noreferrer"
              variant="double"
              onMouseEnter={() => linkRef.current?.startAnimation()}
              onMouseLeave={() => linkRef.current?.stopAnimation()}
              className="text-sm font-medium text-neutral-800 sm:text-base dark:text-neutral-200"
            >
              {overviewData.website}
            </LineHoverLink>
          </div>

          <div
            className="overview-time flex min-h-9 items-center gap-3"
            onMouseEnter={() => clockRef.current?.startAnimation()}
            onMouseLeave={() => clockRef.current?.stopAnimation()}
          >
            <OverviewIcon icon={ClockIcon} iconRef={clockRef} />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
              {time || "00:00"}{" "}
              <span className="font-normal text-neutral-500 dark:text-neutral-400">
                // {timeDiff}
              </span>
            </span>
          </div>

          <div className="overview-email flex min-h-9 items-center gap-3">
            <OverviewIcon icon={AtSignIcon} iconRef={emailRef} />
            <a
              href={`mailto:${overviewData.email}`}
              onMouseEnter={() => emailRef.current?.startAnimation()}
              onMouseLeave={() => emailRef.current?.stopAnimation()}
              className="break-all text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-950 sm:text-base dark:text-neutral-200 dark:hover:text-white"
            >
              {overviewData.email}
            </a>
          </div>

          <div className="overview-gender flex min-h-9 items-center gap-3">
            <OverviewIcon icon={MaleIcon} />
            <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
              {overviewData.gender}
            </span>
          </div>
        </div>

        {/* Socials Row at the Bottom */}
        <SocialLinks />
      </div>
    </section>
  );
}
