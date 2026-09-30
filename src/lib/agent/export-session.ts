/** Browser download helpers for agent session export (resume + transcript). */

export const RESUME_DOWNLOAD_PATH = "/resume/Abhishek-Swami-Resume.pdf";
export const RESUME_DOWNLOAD_FILENAME = "Abhishek-Swami-Resume.pdf";

const EXPORT_DEBOUNCE_MS = 2500;
let lastExportAt = 0;

type MessagePart = { type?: string; text?: string };
type ThreadMessage = {
  role?: string;
  parts?: MessagePart[];
  content?: unknown;
  metadata?: { modality?: string };
};

function partText(part: MessagePart): string {
  if (part.type === "text" && part.text) return part.text;
  return "";
}

export function extractMessageText(message: ThreadMessage): string {
  if (Array.isArray(message.parts)) {
    return message.parts.map(partText).filter(Boolean).join("\n").trim();
  }
  if (typeof message.content === "string") return message.content.trim();
  if (Array.isArray(message.content)) {
    return message.content
      .map((c) => {
        if (typeof c === "string") return c;
        if (c && typeof c === "object" && "text" in c) {
          return String((c as { text?: string }).text ?? "");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return "";
}

export function formatConversationTranscript(
  messages: readonly unknown[]
): string {
  const lines: string[] = [
    "Chat with Abhishek — conversation export",
    `Exported: ${new Date().toLocaleString()}`,
    "https://swamiabhishek.online",
    "",
  ];

  for (const raw of messages) {
    const message = raw as ThreadMessage;
    const text = extractMessageText(message);
    if (!text) continue;
    if (message.role !== "user" && message.role !== "assistant") continue;
    const role = message.role === "user" ? "You" : "Abhishek";
    const viaVoice = message.metadata?.modality === "voice" ? " (voice)" : "";
    lines.push(`${role}${viaVoice}:`);
    lines.push(text);
    lines.push("");
  }

  if (lines.length <= 4) {
    lines.push("(No messages in this session.)");
  }

  return lines.join("\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function downloadResumePdf(): Promise<void> {
  const res = await fetch(RESUME_DOWNLOAD_PATH, { cache: "no-store" });
  if (!res.ok) {
    console.warn("[export-session] Resume download failed", res.status);
    return;
  }
  const blob = await res.blob();
  triggerDownload(blob, RESUME_DOWNLOAD_FILENAME);
}

export function downloadConversationText(transcript: string) {
  const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
  const stamp = new Date().toISOString().slice(0, 10);
  triggerDownload(blob, `abhishek-chat-${stamp}.txt`);
}

export type ExportSessionOptions = {
  messages: readonly unknown[];
  /** When false, skip transcript if there are no messages with text */
  includeTranscript?: boolean;
  includeResume?: boolean;
};

/** Saves resume PDF and conversation .txt to the visitor's device (works on mobile browsers). */
export async function exportAgentSessionFiles(
  options: ExportSessionOptions
): Promise<void> {
  const now = Date.now();
  if (now - lastExportAt < EXPORT_DEBOUNCE_MS) return;
  lastExportAt = now;

  const { messages, includeResume = true, includeTranscript = true } = options;
  const hasContent = messages.some(
    (m) => extractMessageText(m as ThreadMessage).length > 0
  );

  if (includeResume) {
    await downloadResumePdf();
  }

  if (!includeTranscript) return;

  await new Promise((r) => window.setTimeout(r, 350));

  if (hasContent) {
    downloadConversationText(formatConversationTranscript(messages));
  } else {
    downloadConversationText(
      formatConversationTranscript([]).replace(
        "(No messages in this session.)",
        "(Voice session ended — no transcript was captured yet.)"
      )
    );
  }
}
