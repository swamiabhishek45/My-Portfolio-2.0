const PHONE_PATTERN = /(\+?\d[\d\s\-().]{8,}\d)/g;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const SENSITIVE_KEYWORDS =
  /\b(salary|compensation|offer letter|negotiat(?:e|ion)|relationship|spouse|partner|address line)\b/i;

export function sanitizeRetrievedText(text: string): string {
  return text
    .replace(PHONE_PATTERN, "[phone redacted]")
    .replace(EMAIL_PATTERN, "[email redacted]")
    .replace(/tel:\+?\d+/gi, "[phone redacted]");
}

export function isSensitiveUserQuestion(question: string): boolean {
  return SENSITIVE_KEYWORDS.test(question);
}

export function sanitizeProfileForAgent(data: Record<string, unknown>) {
  const copy = { ...data };
  delete copy.phoneRaw;
  if (typeof copy.phone === "string") {
    copy.phone = copy.phone.replace(/\d/g, (d, i) => (i > 4 ? "*" : d));
  }
  return copy;
}
