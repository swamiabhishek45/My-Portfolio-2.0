# Abhishek Swami voice agent — spec pointer

This repository implements the browser-only, first-person portfolio agent (RAG + tools + per-visitor quotas + optional OpenAI Realtime voice).

## Implemented surfaces

- **UI:** Global FAB + sheet panel (`src/components/agent/`)
- **Text:** `POST /api/agent/chat` (Vercel AI SDK + tools)
- **Voice:** `POST /api/voice/session` (Realtime ephemeral token + WebRTC client)
- **Quota:** 10 text + 3 voice user turns per signed `visitor_id` cookie; then Email / LinkedIn CTA (no payments)
- **RAG:** Qdrant collection `abhishek_knowledge_v1`, ingest via `npm run ingest:knowledge`

Operational runbook: [docs/AGENT_OPS.md](docs/AGENT_OPS.md).

Environment template: [.env.example](.env.example).
