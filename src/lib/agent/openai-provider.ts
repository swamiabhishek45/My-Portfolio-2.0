import { createOpenAI } from "@ai-sdk/openai";

/** Shared OpenAI provider for AI SDK (`streamText`, tools, etc.). */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
