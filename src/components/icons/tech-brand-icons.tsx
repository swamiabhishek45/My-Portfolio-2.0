import type { SVGProps } from "react";

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

/** Cursor editor — from Simple Icons, uses currentColor for theme swap. */
export function CursorIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      className={className}
      {...props}
    >
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
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
