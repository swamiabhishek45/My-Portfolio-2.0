"use client";

import { useEffect, useState, useRef } from "react";
import { Lightbulb, User, Globe } from "lucide-react";
import { overviewData } from "@/data/overview";
import SocialLinks from "@/components/social-links";
import { MapPinIcon } from "@/components/ui/map-pin";
import { PhoneIcon } from "@/components/ui/phone";
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
        <Icon ref={iconRef} size={size} className="text-[#5c5e66] dark:text-[#a1a1aa]" />
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
      <span className="text-neutral-800 dark:text-neutral-200 font-semibold text-sm sm:text-base">
        {role.title}{" "}
        {role.company && (
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
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
  const phoneRef = useRef<any>(null);
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

  return (
    <section className="flex flex-col w-full">
      {/* Outer Card Wrapper */}
      <div className="border border-neutral-200 dark:border-neutral-800/80 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10 overflow-hidden font-mono">
        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-y-4 relative">
          {/* Dashed vertical separator (visible on md+) */}
          <div className="hidden md:block absolute top-5 bottom-5 left-1/2 -translate-x-1/2 border-r border-dashed border-neutral-200 dark:border-neutral-800/80" />

          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Roles */}
            {overviewData.roles.map((role, idx) => (
              <RoleItem key={idx} role={role} />
            ))}

            {/* Location */}
            <div
              className="flex items-center gap-3 cursor-default"
              onMouseEnter={() => mapPinRef.current?.startAnimation()}
              onMouseLeave={() => mapPinRef.current?.stopAnimation()}
            >
              <OverviewIcon icon={MapPinIcon} iconRef={mapPinRef} />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
                {overviewData.location}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <OverviewIcon icon={PhoneIcon} iconRef={phoneRef} />
              <a
                href={overviewData.phoneRaw}
                onMouseEnter={() => phoneRef.current?.startAnimation()}
                onMouseLeave={() => phoneRef.current?.stopAnimation()}
                className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-medium text-sm sm:text-base transition-colors"
              >
                {overviewData.phone}
              </a>
            </div>

            {/* Website */}
            <div className="flex items-center gap-3">
              <OverviewIcon icon={LinkIcon} iconRef={linkRef} />
              <a
                href={overviewData.websiteRaw}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => linkRef.current?.startAnimation()}
                onMouseLeave={() => linkRef.current?.stopAnimation()}
                className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-medium text-sm sm:text-base transition-colors"
              >
                {overviewData.website}
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:pl-6">
            {/* Desktop Placeholders */}
            <div className="hidden md:block h-8" />

            {/* Local Time */}
            <div
              className="flex items-center gap-3 cursor-default"
              onMouseEnter={() => clockRef.current?.startAnimation()}
              onMouseLeave={() => clockRef.current?.stopAnimation()}
            >
              <OverviewIcon icon={ClockIcon} iconRef={clockRef} />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
                {time || "00:00"} <span className="text-neutral-500 dark:text-neutral-400 font-normal">// {timeDiff}</span>
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <OverviewIcon icon={AtSignIcon} iconRef={emailRef} />
              <a
                href={`mailto:${overviewData.email}`}
                onMouseEnter={() => emailRef.current?.startAnimation()}
                onMouseLeave={() => emailRef.current?.stopAnimation()}
                className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-medium text-sm sm:text-base transition-colors break-all"
              >
                {overviewData.email}
              </a>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3">
              <OverviewIcon icon={MaleIcon} />
              <span className="text-neutral-800 dark:text-neutral-200 font-medium text-sm sm:text-base">
                {overviewData.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Socials Row at the Bottom */}
        <SocialLinks />
      </div>
    </section>
  );
}
