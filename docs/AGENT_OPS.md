# Agent operations

## Local Qdrant

```bash
docker compose -f docker/docker-compose.qdrant.yml up -d
```

Set `QDRANT_URL=http://127.0.0.1:6333` and `QDRANT_API_KEY` to match compose env.

## Initial ingest

```bash
npm run ingest:knowledge
```

Requires `OPENAI_API_KEY` and reachable Qdrant.

## Reindex after content changes

1. **GitHub Actions:** Settings → Secrets → `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`. Run workflow **Reindex agent knowledge** manually.
2. **Admin API:** `POST /api/admin/reindex` with header `Authorization: Bearer $CRON_SECRET` (dispatches workflow when `GITHUB_REINDEX_DISPATCH=true`).
3. **Local:** `npm run ingest:knowledge`

## Private notes

Place markdown under `knowledge/private/` (gitignored). Frontmatter:

```yaml
---
visibility: public
do_not_expose: false
---
```

Never ingest `visibility: private` or `do_not_expose: true`.

## Visitor limits

Per visitor (cookie): **10 text messages** and **3 voice user turns** (`src/lib/agent/quota.ts`). When a limit is hit, the UI shows Email / LinkedIn — no payments.

## Vercel env

Redis and Qdrant must be reachable from Vercel (HTTPS + auth for Qdrant).

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Chat, embeddings, Realtime voice |
| `QDRANT_URL`, `QDRANT_API_KEY` | RAG vector search |
| `GITHUB_TOKEN` | Live GitHub tools + richer ingest (public repo read) |
| `GITHUB_USERNAME` | Defaults to `swamiabhishek45` |
| `KNOWLEDGE_COLLECTION` | Optional; default `abhishek_knowledge_v1` |
| `AGENT_VOICE_ENABLED` / `NEXT_PUBLIC_AGENT_VOICE_ENABLED` | Realtime voice (default off in prod) |
| `AGENT_QUOTA_DISABLED` | Set `false` in production (enforces 10 text + 3 voice limits) |

### Production cost profile (recommended)

```env
AGENT_VOICE_ENABLED=false
NEXT_PUBLIC_AGENT_VOICE_ENABLED=false
AGENT_QUOTA_DISABLED=false
AGENT_CHAT_MODEL=gpt-4o-mini
```

Visitors get capped demo chat; limits show **Email / LinkedIn**.

## Recruiter knowledge checklist

Update these when your story changes, then **reindex**:

1. **[src/data/career.ts](../src/data/career.ts)** — education, jobs, achievements, current focus, FAQ
2. **[knowledge/public/](../knowledge/public/)** — long-form persona and project narrative (committed)
3. **Project markdown** — `src/data/content/projects/*.md`
4. **Resume PDF:** default `knowledge/public/Abhishek-Swami-Resume.pdf` (override with `RESUME_PDF_PATH`)
5. **Optional:** `knowledge/private/` (gitignored), LinkedIn/X JSON (`LINKEDIN_EXPORT_PATH`, `X_EXPORT_PATH`)

```bash
npm run ingest:knowledge
```

Without Qdrant, the agent still answers via **local fallback** (`buildLocalPortfolioContext`) and tools like `get_career` — but semantic search is weaker until ingest succeeds.

## Local → production Qdrant

1. Run Qdrant locally for development (see above).
2. Create a **Qdrant Cloud** (or other HTTPS) cluster for production.
3. Set the same env vars on Vercel; run `npm run ingest:knowledge` **against production** `QDRANT_URL` from your machine or CI (**Reindex agent knowledge** workflow needs `GITHUB_TOKEN` in secrets for full GitHub chunks).

## Public knowledge markdown

Committed notes live under `knowledge/public/` with frontmatter:

```yaml
---
visibility: public
do_not_expose: false
---
```
