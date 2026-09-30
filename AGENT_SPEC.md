# Abhishek Swami voice agent — spec pointer

This repository implements the browser-only, first-person portfolio agent described in the master implementation prompt (RAG + tools + quota + Razorpay + OpenAI Realtime).

## Implemented surfaces

- **UI:** Global FAB + sheet panel (`src/components/agent/`)
- **Text:** `POST /api/agent/chat` (Vercel AI SDK + tools)
- **Voice:** `POST /api/voice/session` (Realtime ephemeral token + WebRTC client)
- **Quota:** 3 lifetime free user messages per signed `visitor_id` cookie; 1h paid session via Razorpay
- **RAG:** Qdrant collection `abhishek_knowledge_v1`, ingest via `npm run ingest:knowledge`

Operational runbook: [docs/AGENT_OPS.md](docs/AGENT_OPS.md).

Environment template: [.env.example](.env.example).
