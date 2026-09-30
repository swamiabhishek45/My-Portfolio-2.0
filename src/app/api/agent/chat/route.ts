import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  isStepCount,
  streamText,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import {
  appendConversationTurns,
  assertCanSendMessage,
  getConversationHistory,
  recordUserMessage,
} from "@/lib/agent/quota";
import { buildLocalPortfolioContext } from "@/lib/agent/local-context";
import { formatContextBlock, searchKnowledge } from "@/lib/agent/rag/qdrant";
import { rerankChunks } from "@/lib/agent/rag/rerank";
import { checkAgentRateLimit } from "@/lib/agent/rate-limit";
import {
  isSensitiveUserQuestion,
  sanitizeRetrievedText,
} from "@/lib/agent/sanitize";
import {
  buildSystemPrompt,
  OFF_TOPIC_REFUSAL,
  SENSITIVE_REFUSAL,
} from "@/lib/agent/system-prompt";
import { agentToolDefinitions } from "@/lib/agent/tools";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CHAT_MODEL = process.env.AGENT_CHAT_MODEL ?? "gpt-4o-mini";

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const text =
      m.parts
        ?.filter((p) => p.type === "text")
        .map((p) => ("text" in p ? p.text : ""))
        .join("") ?? "";
    if (text.trim()) return text.trim();
  }
  return "";
}

function isLikelyOffTopic(question: string): boolean {
  const q = question.toLowerCase();
  const aboutMe =
    /\b(you|your|abhishek|swami|portfolio|project|stack|resume|github|medium|spotify|wakatime|book|skill|work|job|engineer|built|pune)\b/i;
  if (aboutMe.test(question)) return false;
  const offTopic =
    /\b(homework|leetcode|write code for|news today|weather|bitcoin|who is (?!abhishek)|tell me about elon|recipe for)\b/i;
  return offTopic.test(q) && !aboutMe.test(q);
}

export async function POST(request: Request) {
  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();

  const rl = await checkAgentRateLimit(`chat:${visitorId}`);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = (await request.json()) as { messages?: UIMessage[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const userText = lastUserText(messages);

  const gate = await assertCanSendMessage(visitorId);
  if (!gate.canSend && userText) {
    const response = NextResponse.json(
      { code: gate.reason ?? "QUOTA_EXCEEDED", ...gate },
      { status: 402 }
    );
    if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
    return response;
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Agent is not configured (missing OPENAI_API_KEY)" },
      { status: 503 }
    );
  }

  if (userText && isSensitiveUserQuestion(userText)) {
    await recordUserMessage(visitorId);
    await appendConversationTurns(visitorId, [
      { role: "user", content: userText },
      { role: "assistant", content: SENSITIVE_REFUSAL },
    ]);
    const result = streamText({
      model: openai(CHAT_MODEL),
      prompt: SENSITIVE_REFUSAL,
    });
    return result.toUIMessageStreamResponse({ originalMessages: messages });
  }

  if (userText && isLikelyOffTopic(userText)) {
    await recordUserMessage(visitorId);
    await appendConversationTurns(visitorId, [
      { role: "user", content: userText },
      { role: "assistant", content: OFF_TOPIC_REFUSAL },
    ]);
    const result = streamText({
      model: openai(CHAT_MODEL),
      prompt: OFF_TOPIC_REFUSAL,
    });
    return result.toUIMessageStreamResponse({ originalMessages: messages });
  }

  if (userText) {
    await recordUserMessage(visitorId);
  }

  const chunks = userText
    ? rerankChunks(await searchKnowledge(userText))
    : [];
  const retrievedContext = sanitizeRetrievedText(
    chunks.length > 0
      ? formatContextBlock(chunks)
      : userText
        ? buildLocalPortfolioContext()
        : ""
  );
  const history = await getConversationHistory(visitorId);

  const result = streamText({
    model: openai(CHAT_MODEL),
    system: buildSystemPrompt(retrievedContext),
    messages: [
      ...history.map((t) => ({ role: t.role, content: t.content })),
      ...(await convertToModelMessages(messages)),
    ],
    tools: agentToolDefinitions,
    stopWhen: isStepCount(5),
    onFinish: async ({ text }) => {
      if (userText && text) {
        await appendConversationTurns(visitorId, [
          { role: "user", content: userText },
          { role: "assistant", content: text },
        ]);
      }
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
  });

  if (setCookie && cookieValue) {
    const nextRes = new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
    return attachVisitorCookie(nextRes, cookieValue);
  }

  return response;
}
