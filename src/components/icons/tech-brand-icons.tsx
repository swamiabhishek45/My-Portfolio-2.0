import type { SVGProps } from "react";
import { VscVscode } from "react-icons/vsc";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

export function PineconeIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M12 3L6 8.5V15.5L12 21L18 15.5V8.5L12 3Z"
        fill="currentColor"
      />
      <path
        d="M12 7L9 9.5V13.5L12 16L15 13.5V9.5L12 7Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

export function QdrantIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#DC382D" />
      <path
        d="M8 16V8H11.5C13.4 8 14.5 9 14.5 10.5C14.5 12 13.4 13 11.5 13H10.5V16H8ZM10.5 11H11.4C11.9 11 12.2 10.7 12.2 10.3C12.2 9.9 11.9 9.6 11.4 9.6H10.5V11Z"
        fill="white"
      />
    </svg>
  );
}

export function LangGraphIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <circle cx="6" cy="12" r="2.5" fill="currentColor" />
      <circle cx="12" cy="6" r="2.5" fill="currentColor" />
      <circle cx="18" cy="12" r="2.5" fill="currentColor" />
      <circle cx="12" cy="18" r="2.5" fill="currentColor" />
      <path
        d="M8 11H10M14 11H16M12 8.5V9.5M12 14.5V15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Cursor editor — official logo SVG. Inverts to white in dark mode. */
export function CursorIcon({ className }: { className?: string }) {
  return (
    <img
      src="/cursor.svg"
      alt=""
      aria-hidden
      className={cn("dark:invert", className)}
    />
  );
}

/** VS Code — official mark via react-icons, tinted brand blue. */
export function VSCodeIcon({ className, ...props }: IconProps) {
  return <VscVscode className={className} style={{ color: "#007ACC" }} {...props} />;
}

/** Google Antigravity — brand PNG for small inline use. */
export function AntigravityIcon({ className }: { className?: string }) {
  return (
    <img
      src="/antigravity.png"
      alt=""
      aria-hidden
      className={className}
    />
  );
}

export function getEditorIcon(editor: string) {
  switch (editor) {
    case "Cursor":
      return CursorIcon;
    case "VS Code":
      return VSCodeIcon;
    case "Antigravity":
      return AntigravityIcon;
    default:
      return null;
  }
}

export function McpIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect x="3" y="8" width="8" height="8" rx="2" fill="#6366F1" />
      <rect x="13" y="8" width="8" height="8" rx="2" fill="#8B5CF6" />
      <path d="M11 12H13" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function NeonIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M6 18L10 6H13L9 18H6ZM14 18L18 6H21L17 18H14Z"
        fill="#00E599"
      />
    </svg>
  );
}
